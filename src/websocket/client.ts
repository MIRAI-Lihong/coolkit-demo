import {getLongConnectionAPI} from '@/apis/general'
import {getAppId, getNonce} from '@/utils/getEnv'

import {
  MessageAction,
  UserAgent,
  type ActionMessageHandler,
  type IAppMsgResponse,
  type IDeviceInitMsgResponse,
  type IDeviceMsgResponse,
  type IErrorMsgResponse,
  type IMsgResponse,
  type IOnlineMsgResponse,
  type IPendingHandler,
  type IUpdateMsgRequest,
  type IWebUpdateMsgResponse,
  type ListenResponse
} from '@/types/wss'
import type {IDeviceParams} from '@/types/device'
import {accessTokenStorage, apiKeyStorage} from '@/utils/storage'
import {
  isAppMsg,
  isDeviceInitMsg,
  isDeviceMsg,
  isOnlineMsg,
  isParamErrorMsg,
  isShakeMsg,
  isTimeOutMsg,
  isWebUpdateMsg
} from '@/utils/typeGuard'

function getAuth() {
  const at = accessTokenStorage.get()
  const apikey = apiKeyStorage.get()
  const appid = getAppId()
  return {at, apikey, appid}
}

class Client {
  private ws: WebSocket | null = null
  // 心跳计时器
  private heartbeatTimer: number | null = null
  // 任务队列
  private pendingMap = new Map<string, IPendingHandler>()
  // 监听器
  private listener = new Map<string, Set<ActionMessageHandler<any>>>()
  // 重连次数
  private reconnectAttempts = 0
  // 最大重连数
  private maxReconnectAttempts = 5
  // 重连间隔
  private reconnectInterval = 10000
  // 确定关闭
  private sureClose = false

  constructor() {}

  // 建立连接
  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return

    const {at, apikey, appid} = getAuth()

    if (!at || !apikey || !appid) return
    try {
      // 调用接口获取长连接信息
      const res = await getLongConnectionAPI()
      // 成功获取到信息
      if (res.data.error === 0) {
        // 拼接ws连接url
        const wsURl = `wss://${res.data.domain}:${res.data.port}/api/ws`
        this.ws = new WebSocket(wsURl)

        // 连接成功回调
        this.ws.onopen = () => {
          console.log('WebSocket 连接成功')
          this.reconnectAttempts = 0
          // 握手
          this.handshake(at as string, apikey as string, appid)
        }

        // 握手成功回调
        this.ws.onmessage = e => {
          // 如果是心脏回调，不需要处理
          if (e.data === 'pong') return

          const data: IMsgResponse = JSON.parse(e.data)
          // 处理其他响应的消息
          this.messageHandler(data)
        }

        // 错误回调
        this.ws.onerror = e => {
          console.error('WebSocket 连接出现错误', e)
        }

        // 关闭回调
        this.ws.onclose = () => {
          console.log('WebSocket 连接已经关闭')
          // 没有确定关闭才重连
          if (!this.sureClose) {
            this.reconnect()
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 握手
  private handshake(at: string, apikey: string, appid: string) {
    const data = {
      action: MessageAction.USERONLINE,
      version: 8,
      ts: Math.floor(Date.now() / 1000), // s
      at,
      userAgent: UserAgent.APP,
      apikey,
      appid,
      nonce: getNonce(),
      sequence: Date.now().toString() // ms
    }
    // 发送握手信息
    this.send(data)
  }

  // 消息处理
  private messageHandler(data: IMsgResponse) {
    if (isParamErrorMsg(data)) {
      // 参数错误
      this.errorHandler(data)
      return
    }

    if (isDeviceInitMsg(data)) {
      // 设备联网初始化
      this.deviceInitHandler(data)
      return
    }

    if (isDeviceMsg(data) || isAppMsg(data)) {
      // 设备和app更新处理
      this.deviceAndAppActionHandler(data)
      return
    }

    if (isShakeMsg(data)) {
      // 握手处理
      this.startHeartbeat(data.config.hbInterval)
      return
    }

    if (isWebUpdateMsg(data)) {
      // Web端主动更新处理
      this.webUpdateHandler(data)
      return
    }

    if (isOnlineMsg(data)) {
      // 设备上线\下线处理
      this.onlineOfflineHandler(data)
      return
    }

    if (isTimeOutMsg(data)) {
      // 超时错误处理
      this.errorHandler(data)
      return
    }
  }

  // 错误处理函数
  private errorHandler(data: IErrorMsgResponse) {
    if (data.error !== 504 && data.error !== 400) return
    const sequence = data.sequence
    // 取出对应的请求
    const task = this.pendingMap.get(sequence)
    if (!task) return
    task.reject(data)
    // 当前任务执行完成，直接删除
    this.pendingMap.delete(sequence)
  }

  // 取消连接
  disconnect() {
    this.stopHeartbeat()
    this.sureClose = true
    this.ws?.close()
    this.ws = null
  }

  // 重连
  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      )
      setTimeout(() => {
        this.connect()
      }, this.reconnectInterval)
    } else {
      console.log('最大重连失败，终止重连')
    }
  }

  // 更新设备
  update(deviceid: string, params: IDeviceParams) {
    const {apikey} = getAuth()
    const safeApiKey = apikey ?? ''
    return this.request({
      action: MessageAction.UPDATE,
      deviceid,
      apikey: safeApiKey,
      params,
      userAgent: UserAgent.APP
    })
  }

  // 开启心跳
  private startHeartbeat(hbInterval: number) {
    this.stopHeartbeat()
    // 计算心跳间隔
    const newHbInterval = hbInterval * (0.8 + Math.random() * 0.2) * 1000
    // 开启心跳定时
    this.heartbeatTimer = setInterval(() => {
      this?.ws?.send('ping')
    }, newHbInterval)
  }

  // 停止心跳
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
  }

  // ws 发送消息
  private send<T>(data: T) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify(data))
  }

  // 将消息的返回结果封装成一个Promise
  private request(data: IUpdateMsgRequest) {
    return new Promise<IWebUpdateMsgResponse>((resolve, reject) => {
      // 时间戳，通过时间戳来表示同一次操作
      const sequence = Date.now().toString()

      // 记录当前任务记录
      this.pendingMap.set(sequence, {
        resolve,
        reject
      })

      // 发送查询信息给服务端
      this.send({...data, sequence})
    })
  }

  // 设备更新处理
  private deviceAndAppActionHandler(
    data: IAppMsgResponse | IDeviceMsgResponse
  ) {
    const deviceid = data.deviceid
    // 设备 update 消息回调 将数据传给回调函数
    this.emit(`device_update:${deviceid}`, data)
  }

  // 设备上线\离线处理
  private onlineOfflineHandler(data: IOnlineMsgResponse) {
    const deviceid = data.deviceid
    if (data.params.online) {
      // 设备上线
      this.emit(`device_online:${deviceid}`, data)
    } else {
      // 设备下线
      this.emit(`device_offline:${deviceid}`, data)
    }
  }

  // 设备联网初始化处理
  private deviceInitHandler(data: IDeviceInitMsgResponse) {
    const deviceid = data.deviceid
    this.emit(`device_init:${deviceid}`, data)
  }

  // Web端主动更新处理
  private webUpdateHandler(data: IWebUpdateMsgResponse) {
    // 当ws服务器下发查询数据后，找到之前存取的任务
    const task = this.pendingMap.get(data.sequence)
    if (!task) return
    // 然后兑现Promise，将数据返回
    task.resolve(data)
    // 当前任务执行完成，直接删除
    this.pendingMap.delete(data.sequence)
  }

  // 监听任务 存储回调
  on<T extends ListenResponse>(event: string, callback: (data: T) => void) {
    if (!this.listener.get(event)) {
      // 第一次存 设置空Set
      this.listener.set(event, new Set())
    }
    this.listener.get(event)?.add(callback)
  }

  // 关闭监听 删除回调
  off<T extends ListenResponse>(event: string, callback: (data: T) => void) {
    this.listener.get(event)?.delete(callback)
  }

  // 发布
  private emit(event: string, data: ListenResponse) {
    // 取出回调进行消费
    this.listener.get(event)?.forEach(cb => cb(data))
  }
}

export const client = new Client()
