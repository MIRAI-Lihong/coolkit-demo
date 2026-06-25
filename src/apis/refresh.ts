import axios, {type AxiosRequestConfig} from 'axios'

interface IRefreshResponse {
  data: {
    at: string
    rt: string
  }
  error: number
}

export function refreshAPI(data: {rt: string}, config: AxiosRequestConfig) {
  return axios.post<IRefreshResponse>('/v2/user/refresh', data, config)
}
