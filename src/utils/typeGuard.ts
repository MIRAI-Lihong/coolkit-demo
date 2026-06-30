import {
  type IMsgResponse,
  type IDeviceMsgResponse,
  UserAgent,
  type IAppMsgResponse,
  type IShakeMsgResponse,
  type IUpdateMsgResponse,
  type IOnlineMsgResponse,
  MessageAction,
  type IDeviceInitMsgResponse,
  type IErrorMsgResponse
} from '@/types/wss'

// 判断是否为设备更新消息
export function isDeviceMsg(msg: IMsgResponse): msg is IDeviceMsgResponse {
  return (
    'action' in msg &&
    msg.action === MessageAction.UPDATE &&
    'userAgent' in msg &&
    msg.userAgent === UserAgent.DEVICE
  )
}

// 判断是否为App更新消息
export function isAppMsg(msg: IMsgResponse): msg is IAppMsgResponse {
  return (
    'action' in msg &&
    msg.action === MessageAction.UPDATE &&
    'userAgent' in msg &&
    msg.userAgent === UserAgent.APP
  )
}

// 判断是否为握手消息
export function isShakeMsg(msg: IMsgResponse): msg is IShakeMsgResponse {
  return 'config' in msg
}

// 判断是否为网页主动更新消息
export function isUpdateMsg(msg: IMsgResponse): msg is IUpdateMsgResponse {
  return 'uid' in msg
}

// 判断设备是否为上线、离线消息
export function isOnlineMsg(msg: IMsgResponse): msg is IOnlineMsgResponse {
  return 'action' in msg && msg.action === MessageAction.SYSMSG
}

// 判断设备是否为上线初始化信息
export function isDeviceInitMsg(
  msg: IMsgResponse
): msg is IDeviceInitMsgResponse {
  return (
    'action' in msg &&
    msg.action === MessageAction.UPDATE &&
    'd_seq' in msg &&
    'userAgent' in msg &&
    msg.userAgent === UserAgent.DEVICE
  )
}

// 判断是否为 504 超时信息
export function isTimeOutMsg(msg: IMsgResponse): msg is IErrorMsgResponse {
  return 'error' in msg && msg.error === 504
}
