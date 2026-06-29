import CryptoJS from 'crypto-js'
import type {ILoginAPI, IRefresh} from '../types/auth'
import {getAppSecret} from './getEnv'

export function createSign(msg: ILoginAPI | IRefresh | string) {
  // 获取appSecret
  const appSecret = getAppSecret()
  let wordArray
  if (typeof msg === 'string') {
    wordArray = CryptoJS.enc.Utf8.parse(msg)
  } else {
    // 先将对象转换成json，之后再转成字节数组
    wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(msg))
  }

  // 进行HmacSHA256加密，返回base64编码后的字符串
  // HmacSHA256：将要传输的消息通过散列函数进行处理，得到一个消息摘要。接着将该消息摘要与密钥进行异或运算，并继续使用散列函数对运算结果进行处理，得到一个最终的认证码
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(wordArray, appSecret)
  )
}

export function getAndDelMsg(data: object) {
  const res: string[] = []
  Object.keys(data).forEach(key => {
    const value = data[key as keyof typeof data]
    const splicing = `${key}=${value}`
    res.push(splicing)
  })
  return res.join('&')
}
