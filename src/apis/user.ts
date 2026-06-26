import type {ILoginAPI, ILoginResponse} from '@/types/auth'
import {request} from '@/utils/request'

export function loginAPI(data: ILoginAPI) {
  return request.post<{error: number; msg: string; data: ILoginResponse}>(
    '/v2/user/login',
    data
  )
}

export function logoutAPI() {
  return request.delete('/v2/user/logout')
}
