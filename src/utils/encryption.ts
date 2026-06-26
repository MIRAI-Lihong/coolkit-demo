import CryptoJS from 'crypto-js'
import type {ILoginAPI, IRefresh} from '../types/auth'

export function createSign(appSecret: string, body: ILoginAPI | IRefresh) {
  const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(body))

  // HMAC-SHA256
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(wordArray, appSecret)
  )
}
