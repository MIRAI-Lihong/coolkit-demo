import {wsDomain} from '@/configs/region'
import type {IDispatchResponse} from '@/types/wss'
import {regionStorage} from '@/utils/storage'
import axios from 'axios'

// 获取长连接信息  需要向另外的域名发送请求
export function getLongConnectionAPI() {
  const region = regionStorage.get()
  const baseURL = wsDomain[region as keyof typeof wsDomain]
  return axios.get<IDispatchResponse>('/dispatch/app', {
    baseURL
  })
}
