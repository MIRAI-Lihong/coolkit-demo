import type {IDispatchResponse} from '@/types/websocket'
import {request} from '@/utils/request'

// 获取长连接信息
export function getLongConnectionAPI() {
  return request.get<IDispatchResponse>('/dispatch/app', {
    // 需要向另外的域名发送请求
    baseURL: 'https://cn-dispa.coolkit.cn'
  })
}
