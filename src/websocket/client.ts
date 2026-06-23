import {getLongConnectionAPI} from '@/apis/connect'
import {getAppId, getNonce} from '@/utils/getEnv'
import {getToken} from '@/utils/token'
import {getApiKey} from '@/utils/apikey'
import type {IMessageResponse} from '@/types/websocket'
import type {IDeviceParams} from '@/types/device'

function getAuth() {
  const at = getToken()
  const apikey = getApiKey()
  const appid = getAppId()
  return {at, apikey, appid}
}

class Client {
  private ws: WebSocket | null = null
  private heartbeatTimer: number | null = null

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
  handshake(at: string, apikey: string, appid: string) {
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

  // 处理
  messageHandler(data: IMessageResponse) {
    if (data.error === 0) {
      // 成功获取到消息后，计算心跳间隔
      const hbInterval = data.config.hbInterval * (0.8 + Math.random() * 0.2)
      // 开启心跳
      this.startHeartbeat(hbInterval)
    }
  }

  // 取消连接
  disconnect() {
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }

  // 查询设备信息
  query(deviceid: string) {
    const {apikey} = getAuth()
    const data = {
      action: 'query',
      deviceid,
      apikey,
      sequence: Date.now().toString(),
      params: ['switches'], // 如果返回为空，可以使用[]查询所有字段状态
      userAgent: 'app'
    }
    this.send(data)
  }

  // 更新设备
  // todo params 格式确定
  update(deviceid: string, params: IDeviceParams) {
    const {apikey} = getAuth()
    const data = {
      action: 'update',
      deviceid,
      apikey,
      userAgent: 'app',
      sequence: Date.now().toString(),
      params
    }
    this.send(data)
  }

  // 开启心跳
  startHeartbeat(hbInterval: number) {
    this.stopHeartbeat()
    // console.log(hbInterval * 1000 + 's')
    this.heartbeatTimer = setInterval(() => {
      // todo ping 的格式不确定
      this.send({ping: 'ping'})
    }, hbInterval * 1000)
  }

  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
  }

  // ws 发送消息
  send(data: object) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data))
    }
  }
}

export const client = new Client()
