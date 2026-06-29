import {
  type IMsgResponse,
  type IDeviceMsgResponse,
  UserAgent,
  type IAppMsgResponse,
  type IShakeMsgResponse,
  type IUpdateMsgResponse
} from '@/types/wss'

// 判断是否为设备更新消息
export function isDeviceMsg(msg: IMsgResponse): msg is IDeviceMsgResponse {
  return 'userAgent' in msg && msg.userAgent === UserAgent.DEVICE
}

// 判断是否为App更新消息
export function isAppMsg(msg: IMsgResponse): msg is IAppMsgResponse {
  return 'userAgent' in msg && msg.userAgent === UserAgent.APP
}

// 判断是否为握手消息
export function isShakeMsg(msg: IMsgResponse): msg is IShakeMsgResponse {
  return 'config' in msg
}

// 判断是否为网页主动更新消息
export function isUpdateMsg(msg: IMsgResponse): msg is IUpdateMsgResponse {
  return 'uid' in msg
}
