import {useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {message} from 'antd'
import {loginAPI} from '@/apis/user'
import type {ILoginAPI} from '@/types/login'

import {areaCodes} from '../data'
import {
  accessTokenStorage,
  apiKeyStorage,
  refreshTokenStorage,
  regionStorage
} from '@/utils/storage'

interface LoginFormValues {
  phoneNumber: string
  password: string
  countryCode: string
}

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setLocalValue = (
    at: string,
    apiKey: string,
    region: string,
    rt: string
  ) => {
    accessTokenStorage.set(at)
    apiKeyStorage.set(apiKey)
    regionStorage.set(region)
    refreshTokenStorage.set(rt)
  }

  const handleLogin = async (formValues: LoginFormValues) => {
    const {phoneNumber, password, countryCode} = formValues
    const splicingPhone = countryCode + phoneNumber
    const params: ILoginAPI = {
      password,
      phoneNumber: splicingPhone,
      countryCode
    }

    try {
      setLoading(true)
      const res = await loginAPI(params)
      const data = res.data

      if (data.error === 0) {
        const {
          at,
          rt,
          user: {apikey},
          region
        } = data.data
        // 将at、apikey、region、rt存在本地
        setLocalValue(at, apikey, region, rt)
        message.success('登录成功')
        setTimeout(() => {
          navigate('/')
        }, 500)
      }
      if (data.error === 10001) {
        message.error('登录密码错误')
      }
      if (data.error === 10003) {
        message.error('用户不存在')
      }
      if (data.error === 10004) {
        // 此时会接口会进行重定向，返回当前手机号的region，重新登录
        regionStorage.set(data.data.region)
        await handleLogin(formValues)
      }
    } catch (error) {
      console.log(error)
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const options = useMemo(() => {
    return areaCodes.map(area => {
      const [areaCode, areaName] = Object.entries(area)[0]
      return {
        value: areaCode,
        label: `${areaName}(${areaCode})`
      }
    })
  }, [])

  return {
    loading,
    options,
    handleLogin
  }
}
