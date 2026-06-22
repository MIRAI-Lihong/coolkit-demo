import CryptoJS from 'crypto-js'
import type {ILoginAPI} from '../types/login'
// import {getAppSecret, getNonce} from './getEnv'

// export function encryptedData(data) {
//   // appid对应的secret
//   const appSecret = getAppSecret()

//   // 固定8位随机值（取值自：X-CK-Nonce）
//   const nonce = getNonce()

//   // 初始化向量 (IV) - 固定为16位，不足往前面填充0
//   const iv = (nonce ?? '').padStart(16, '0')

//   // 将数据对象转换为JSON字符串
//   const jsonStr = JSON.stringify(data)

//   // ============== 加密开始 ==============

//   // 1. 生成AES密钥 (使用SHA-256哈希并取前32个字符)
//   const hashedKey = CryptoJS.SHA256(appSecret).toString()

//   // 取前32个字符(16字节)
//   const aesKey = hashedKey.substring(0, 32)

//   // 2. 创建密钥和IV的Buffer
//   const key = CryptoJS.enc.Hex.parse(aesKey)

//   const ivWordArray = CryptoJS.enc.Utf8.parse(iv)

//   // ========= 3. AES-CBC 加密 =========
//   const encrypted = CryptoJS.AES.encrypt(jsonStr, key, {
//     iv: ivWordArray,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   })

//   return encrypted.toString()
// }

export function createSign(appsecret: string, body: ILoginAPI) {
  const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(body))

  // HMAC-SHA256
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(wordArray, appsecret)
  )
}
