export interface IDispatchResponse {
  port: number
  domain: string
  error: number
}

export interface IHandshakeRequest {
  action: 'userOnline'
  version: 8
  ts: number
  at: string
  userAgent: 'app'
  apikey: string
  appid: string
  nonce: string
  sequence: string
}

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
  config: IMessageConfigResponse
  error: number
}
