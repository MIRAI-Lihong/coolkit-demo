import type {IDeviceParams} from './device'

// 长连接信息返回结构
export interface IDispatchResponse {
  port: number
  domain: string
  error: number
}

// 心脏配置返回结构
interface IMessageConfigResponse {
  hb: number
  hbInterval: number
}

export type IMsgResponse =
  | IDeviceMsgResponse
  | IAppMsgResponse
  | IShakeMsgResponse
  | IWebUpdateMsgResponse
  | IOnlineMsgResponse
  | IDeviceInitMsgResponse
  | IErrorMsgResponse

// 设备更新返回结构
export interface IDeviceMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.DEVICE
  seq?: string // 设备上线后也会返回一条消息,没有seq
}

// app更新返回结构
export interface IAppMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.APP
  sequence: string
}

// 握手成功返回结构
export interface IShakeMsgResponse {
  config: IMessageConfigResponse
  error: number
  apikey: string
  sequence: string
}

// Web端主动更新后返回结构
export interface IWebUpdateMsgResponse {
  error: number
  deviceid: string
  apikey: string
  sequence: string
  uid: string
}

// 设备上线\下线返回结构
export interface IOnlineMsgResponse {
  action: MessageAction.SYSMSG
  deviceid: string
  apikey: string
  params: {
    online: boolean
  }
  sequence: string
}

// 设备上线后联网成功返回结构
export interface IDeviceInitMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IInitParams
  userAgent: UserAgent.DEVICE
  d_seq: number
}

// 504 或者 400 错误提示
export interface IErrorMsgResponse {
  error: ErrorCode
  reason?: string
  deviceid: string
  apikey: string
  sequence: string
}

interface IInitParams {
  sledOnline: string
  ssid: string
  bssid: string
}

type ErrorCode = 504 | 400

// Web端主动更新发送结构
export interface IUpdateMsgRequest {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.APP
  sequence?: string
}

export type ListenResponse =
  | IAppMsgResponse
  | IDeviceMsgResponse
  | IOnlineMsgResponse
  | IDeviceInitMsgResponse

export type ActionMessageHandler<T> = (data: T) => void

export interface IPendingHandler {
  resolve: (value: IWebUpdateMsgResponse) => void
  reject: (value: IErrorMsgResponse) => void
}

export enum MessageAction {
  UPDATE = 'update',
  SYSMSG = 'sysmsg',
  USERONLINE = 'userOnline'
}

export enum UserAgent {
  DEVICE = 'device',
  APP = 'app'
}
