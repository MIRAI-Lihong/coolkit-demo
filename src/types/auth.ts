import type {IUserResponse} from './user'

export interface ILoginAPI {
  phoneNumber?: string
  email?: string
  password: string
  countryCode: string
}

export interface ILoginResponse {
  at: string
  rt: string
  region: string
  user: IUserResponse
}

export interface IRefreshResponse {
  data: {
    at: string
    rt: string
  }
  error: number
}

export interface IRefresh {
  rt: string
}

export interface IGetRegion {
  countryCode: string
}

export interface IRegionResponse {
  data: {
    region: string
  }
}
