import {request} from '@/utils/request'
import type {IFamilyListResponse} from '@/types/family'
import type {IThingListResponse} from '@/types/device'

export interface IHomeInfoResponse {
  familyInfo: IFamilyListResponse
  thingInfo: IThingListResponse
}

interface IHomeInfoRequest {
  getFamily: object
  getThing: {
    num?: number // 每页数量
    beginIndex?: number // 开始索引 默认是从-9999999开始
  }
}

export function getHomeInfoAPI(data: IHomeInfoRequest) {
  return request.post<{data: IHomeInfoResponse}>('/v2/homepage', data)
}
