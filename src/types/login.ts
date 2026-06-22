export interface ILoginAPI {
  phoneNumber: string
  password: string
  countryCode: string
}

export interface ILoginResponse {
  at: string
  rt: string
  region: string
}
