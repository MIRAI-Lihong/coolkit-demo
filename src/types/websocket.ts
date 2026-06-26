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

export interface IMessageResponse {
  config?: IMessageConfigResponse
  error?: number
  action?: string
  params?: IDeviceParams
  userAgent?: string
  sequence?: string
}

export type ActionMessageHandler = (data: IMessageResponse) => void
export interface IPendingHandler {
  resolve: (value: IMessageResponse) => void
  reject: (value: IMessageResponse) => void
}
