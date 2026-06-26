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
import {client} from '@/websocket/client'

interface LoginFormValues {
  phoneNumber: string
  password: string
  countryCode: string
}

// 错误码
enum ErrorCode {
  // 密码错误
  PASSWORD_ERROR = 10001,
  // 用户不存在
  NotExist_ERROR = 10003,
  // 重定向
  REDIRECT_ERROR = 10004
}

export function useLogin() {
  // 登录loading
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 统一将数据存储在本地
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

  // 登录逻辑
  const handleLogin = async (formValues: LoginFormValues) => {
    const {phoneNumber, password, countryCode} = formValues
    // 电话格式 +8615390228021
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
        // 开启长连接
        client.connect()
        message.success('登录成功')
        setTimeout(() => {
          navigate('/')
        }, 500)
        return
      }

      // 错误状态
      switch (data.error) {
        case ErrorCode.PASSWORD_ERROR:
          message.error('登录密码错误')
          break
        case ErrorCode.NotExist_ERROR:
          message.error('用户不存在')
          break
        case ErrorCode.REDIRECT_ERROR:
          // 重定向，返回当前手机号的region，重新登录
          regionStorage.set(data.data.region)
          await handleLogin(formValues)
          break
        default:
          message.error('登录失败，请检查账号和密码')
          break
      }
    } catch (error) {
      console.log(error)
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 处理区号下拉框数据
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
