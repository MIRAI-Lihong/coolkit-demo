import CryptoJS from 'crypto-js'
import type {ILoginAPI, IRefresh} from '../types/auth'
import {getAppSecret} from './getEnv'

export function createSign(body: ILoginAPI | IRefresh) {
  // 获取appSecret
  const appSecret = getAppSecret()
  // 先将body转换成json，之后再转成字节数组
  const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(body))

  // 进行HmacSHA256加密，返回base64编码后的字符串
  // HmacSHA256：将要传输的消息通过散列函数进行处理，得到一个消息摘要。接着将该消息摘要与密钥进行异或运算，并继续使用散列函数对运算结果进行处理，得到一个最终的认证码
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(wordArray, appSecret)
  )
}
