import {request} from '@/utils/request'

export function getHomeInfoAPI(data: any) {
  return request({
    url: '/v2/homepage',
    method: 'POST',
    data
  })
}
