import type {ILoginAPI, ILoginResponse} from '@/types/login'
import {request} from '@/utils/request'

export function loginAPI(data: ILoginAPI) {
  return request.post<{error: number; msg: string; data: ILoginResponse}>(
    '/v2/user/login',
    data
  )
}
