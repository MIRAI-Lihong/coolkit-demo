import type {IRefreshResponse, IRegionResponse} from '@/types/auth'
import axios, {type AxiosRequestConfig} from 'axios'

export function refreshAPI(data: {rt: string}, config: AxiosRequestConfig) {
  return axios.post<IRefreshResponse>('/v2/user/refresh', data, config)
}

export function getRegionAPI(
  params: {countryCode: string},
  config: AxiosRequestConfig
) {
  const {countryCode} = params
  return axios.get<IRegionResponse>(
    `/v2/utils/get-region?countryCode=${countryCode}`,
    config
  )
}
