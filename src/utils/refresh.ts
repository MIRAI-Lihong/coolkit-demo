import {refreshAPI} from '@/apis/refresh'
import {accessTokenStorage, refreshTokenStorage, regionStorage} from './storage'
import {message} from 'antd'
import {regionMap} from '@/configs/region'
import {getAppId, getAppSecret, getNonce} from './getEnv'
import {createSign} from './encryption'

export const refresh = async () => {
  const appSecret = getAppSecret()
  const rt = refreshTokenStorage.get()
  const region = regionStorage.get()

  if (rt) {
    try {
      const data = {rt}
      const sign = createSign(appSecret, data)
      const config = {
        baseURL: regionMap[region as keyof typeof regionMap],
        headers: {
          'X-CK-Appid': getAppId(),
          Authorization: `Sign ${sign}`,
          'Content-Type': 'application/json',
          'X-CK-Nonce': getNonce()
        }
      }
      const res = await refreshAPI(data, config)
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
