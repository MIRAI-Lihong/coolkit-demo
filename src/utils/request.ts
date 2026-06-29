// axios封装处理
import axios from 'axios'
import {createSign} from './encryption'
import {getAppId, getNonce} from './getEnv'
import {accessTokenStorage, regionStorage, removeAll} from './storage'
import {regionMap} from '@/configs/region'
import {refresh} from './refresh'
import {message} from 'antd'

const request = axios.create({
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 根据地区动态设置baseURL
    const region = regionStorage.get()
    if (region) {
      const baseURL = regionMap[region as keyof typeof regionMap]
      config.baseURL = baseURL
    }

    // 设置通用请求头
    config.headers.set('X-CK-Appid', getAppId())
    config.headers.set('X-CK-Nonce', getNonce())
    config.headers.set('Content-Type', 'application/json')

    // 如果是登录接口，需要计算sign
    if (config.url === '/v2/user/login') {
      const {data: body} = config
      const sign = createSign(body)
      config.headers.Authorization = `Sign ${sign}`
    } else {
      // 不是登录接口，直接从本地获取到at
      const at = accessTokenStorage.get()
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
  async response => {
    if (response.data?.error === 401) {
      message.error('账号已在别处登录，请重新登录')
      removeAll()
      window.location.href = '/login'
    }
    // 当响应 402 时 调用刷新at的接口
    if (response.data?.error === 402) {
      await refresh()
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
export {request}
