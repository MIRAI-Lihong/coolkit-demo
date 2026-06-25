import {refreshAPI} from '@/apis/refresh'
import {accessTokenStorage, refreshTokenStorage, regionStorage} from './storage'
import {message} from 'antd'
import {regionMap} from '@/configs/region'
import {getAppId} from './getEnv'

export const refresh = async () => {
  const rt = refreshTokenStorage.get()
  const region = regionStorage.get()
  const at = accessTokenStorage.get()
  const config = {
    baseURL: regionMap[region as keyof typeof regionMap],
    headers: {
      'X-CK-Appid': getAppId(),
      Authorization: `Bearer ${at}`
    }
  }
  if (rt) {
    try {
      const res = await refreshAPI({rt}, config)
      if (res.data.error === 0) {
        const {at, rt} = res.data.data
        refreshTokenStorage.set(rt)
        accessTokenStorage.set(at)
      }
    } catch (error) {
      message.error((error as Error).message)
    }
  }
}
