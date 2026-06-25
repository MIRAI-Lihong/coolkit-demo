import {getLongConnectionAPI} from '@/apis/general'
import {getAppId, getNonce} from '@/utils/getEnv'

import type {IMessageResponse} from '@/types/websocket'
import type {IDeviceParams} from '@/types/device'
import {accessTokenStorage, apiKeyStorage} from '@/utils/storage'

type ActionMessageHandler = (data: IMessageResponse) => void
interface IPendingHandler {
  resolve: (value: IMessageResponse) => void
  reject: (value: IMessageResponse) => void
}

function getAuth() {
  const at = accessTokenStorage.get()
  const apikey = apiKeyStorage.get()
  const appid = getAppId()
  return {at, apikey, appid}
}

class Client {
  private ws: WebSocket | null = null
  private heartbeatTimer: number | null = null
  private pendingMap = new Map<string, IPendingHandler>()
  private listener = new Map<string, Set<ActionMessageHandler>>()

  constructor() {}

  // 建立连接
  async connect() {
    if (this.ws) return

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
          // 握手
          this.handshake(at as string, apikey as string, appid)
        }

        // 握手成功回调
        this.ws.onmessage = e => {
          const data: IMessageResponse = JSON.parse(e.data)
          // 调用处理消息
          this.messageHandler(data)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 握手
  private handshake(at: string, apikey: string, appid: string) {
    const data = {
      action: 'userOnline',
      version: 8,
      ts: Math.floor(Date.now() / 1000), // s
      at,
      userAgent: 'app',
      apikey,
      appid,
      nonce: getNonce(),
      sequence: Date.now().toString()
    }
    // 发送握手信息
    this.send(data)
  }

  // 消息处理
  private messageHandler(data: IMessageResponse) {
    if (data.action) {
      this.actionHandler(data)
      return
    } else if (data.config) {
      // userOnline 信息处理 开启心跳
      this.startHeartbeat(data.config.hbInterval)
      return
    }
    // 查询消息处理
    this.queryHandler(data)
  }

  // 取消连接
  disconnect() {
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }

  // 查询设备信息
  query(deviceid: string, params: string[] = []) {
    const {apikey} = getAuth()
    return this.request({
      action: 'query',
      deviceid,
      apikey,
      params, // 可以使用[]查询所有字段状态
      userAgent: 'app'
    })
  }

  // 更新设备
  update(deviceid: string, params: IDeviceParams) {
    const {apikey} = getAuth()
    return this.request({
      action: 'update',
      deviceid,
      apikey,
      params,
      userAgent: 'app'
    })
  }

  // 开启心跳
  private startHeartbeat(hbInterval: number) {
    this.stopHeartbeat()
    // 计算心跳间隔
    const newHbInterval = hbInterval * (0.8 + Math.random() * 0.2) * 1000
    // 开启心跳定时
    this.heartbeatTimer = setInterval(() => {
      this.send('ping')
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
  private request<T>(data: T) {
    return new Promise<IMessageResponse>((resolve, reject) => {
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
  private actionHandler(data: IMessageResponse) {
    // 设备 update 消息回调 将数据传给回调函数
    this.emit('device_update', data)
  }

  // 查询数据处理
  private queryHandler(data: IMessageResponse) {
    // 当ws服务器下发查询数据后，找到之前存取的任务
    const task = this.pendingMap.get(data.sequence as string)
    if (!task) return
    // 然后兑现Promise，将数据返回
    task.resolve(data)
    // 当前任务执行完成，直接删除
    this.pendingMap.delete(data.sequence as string)
  }

  // 监听任务 存储回调
  on(event: string, callback: (data: IMessageResponse) => void) {
    if (!this.listener.get(event)) {
      this.listener.set(event, new Set())
    }
    this.listener.get(event)?.add(callback)
  }

  // 关闭监听 删除回调
  off(event: string, callback: (data: IMessageResponse) => void) {
    this.listener.get(event)?.delete(callback)
  }

  // 消费
  private emit(event: string, data: IMessageResponse) {
    // 取出回调进行消费
    this.listener.get(event)?.forEach(cb => cb(data))
  }

  reconnect() {
    setTimeout(() => {})
  }
}

export const client = new Client()
