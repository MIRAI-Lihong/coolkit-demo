import CryptoJS from 'crypto-js'
import type {ILoginAPI} from '../types/login'

export function createSign(appSecret: string, body: ILoginAPI) {
  const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(body))

  // HMAC-SHA256
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(wordArray, appSecret)
  )
}
