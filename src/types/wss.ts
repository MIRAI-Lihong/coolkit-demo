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

export interface IDeviceMsgResponse {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.DEVICE
  seq: string
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
export interface IUpdateMsgRequest {
  action: MessageAction.UPDATE
  deviceid: string
  apikey: string
  params: IDeviceParams
  userAgent: UserAgent.APP
  sequence?: string
}

export type ActionMessageHandler = (
  data: IAppMsgResponse | IDeviceMsgResponse
) => void

export interface IPendingHandler {
  resolve: (value: IUpdateMsgResponse) => void
  reject: (value: IUpdateMsgResponse) => void
}

export enum MessageAction {
  UPDATE = 'update'
}

export enum UserAgent {
  DEVICE = 'device',
  APP = 'app'
}
