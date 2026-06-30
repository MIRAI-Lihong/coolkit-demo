import type {IDeviceParams} from './device'

export interface IDispatchResponse {
  port: number
  domain: string
  error: number
}

interface IMessageConfigResponse {
  hb: number
  hbInterval: number
}

export type IMsgResponse =
  | IDeviceMsgResponse
  | IAppMsgResponse
  | IShakeMsgResponse
  | IUpdateMsgResponse
  | IOnlineMsgResponse
  | IDeviceInitMsgResponse
  | IErrorMsgResponse

export interface IDeviceMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.DEVICE
  seq?: string
}

export interface IAppMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.APP
  sequence: string
}

export interface IShakeMsgResponse {
  config: IMessageConfigResponse
  error: number
  apikey: string
  sequence: string
}

export interface IUpdateMsgResponse {
  error: number
  deviceid: string
  apikey: string
  sequence: string
  uid: string
}

export interface IOnlineMsgResponse {
  action: MessageAction.SYSMSG
  deviceid: string
  apikey: string
  params: {
    online: boolean
  }
  sequence: string
}

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

export interface IUpdateMsgRequest {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.APP
  sequence?: string
}

export type ActionMessageHandler = (
  data:
    | IAppMsgResponse
    | IDeviceMsgResponse
    | IOnlineMsgResponse
    | IDeviceInitMsgResponse
) => void

export interface IPendingHandler {
  resolve: (value: IUpdateMsgResponse) => void
  reject: (value: IErrorMsgResponse) => void
}

export enum MessageAction {
  UPDATE = 'update',
  SYSMSG = 'sysmsg'
}

export enum UserAgent {
  DEVICE = 'device',
  APP = 'app'
}
