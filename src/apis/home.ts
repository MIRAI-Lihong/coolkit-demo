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
    num?: number
  }
}

export function getHomeInfoAPI(data: IHomeInfoRequest) {
  return request.post<{data: IHomeInfoResponse}>('/v2/homepage', data)
}
