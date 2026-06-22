// axios封装处理
import axios from 'axios'
import {createSign} from './encryption'
import {getAppId, getAppSecret, getNonce} from './getEnv'
import {getToken} from './token'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    config.headers.set('X-CK-Appid', getAppId())
    config.headers.set('X-CK-Nonce', getNonce())
    config.headers.set('Content-Type', 'application/json')

    // 如果是登录接口，需要计算sign
    if (config.url === '/v2/user/login') {
      const {data: body} = config
      const appSecret = getAppSecret()
      const sign = createSign(appSecret, body)
      config.headers.Authorization = `Sign ${sign}`
    } else {
      // 不是登录接口，直接从本地获取到at
      const at = getToken()
      config.headers.Authorization = `Bearer ${at}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)
export {request}
