import type {IRefreshResponse} from '@/types/auth'
import axios, {type AxiosRequestConfig} from 'axios'

export function refreshAPI(data: {rt: string}, config: AxiosRequestConfig) {
  return axios.post<IRefreshResponse>('/v2/user/refresh', data, config)
}
