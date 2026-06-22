import type {ILoginAPI} from '@/types/login'
import {request} from '@/utils/request'

export function loginAPI(data: ILoginAPI) {
  return request({
    url: '/v2/user/login',
    method: 'POST',
    data
  })
}
