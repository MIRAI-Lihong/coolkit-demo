import {useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {message} from 'antd'
import {loginAPI} from '@/apis/login'
import type {ILoginAPI} from '@/types/login'
import {setToken} from '@/utils/token'
import {setApiKey} from '@/utils/apikey'
import {areaCodes} from '../data'

export interface LoginFormValues {
  phoneNumber: string
  password: string
}

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setLocalValue = (at: string, apiKey: string) => {
    setToken(at)
    setApiKey(apiKey)
  }

  const handleLogin = async (formValues: LoginFormValues) => {
    console.log(formValues)
    setLoading(true)

    const countryCode = '+86'
    const {phoneNumber, password} = formValues
    const params: ILoginAPI = {
      password,
      phoneNumber: countryCode + phoneNumber,
      countryCode
    }

    try {
      const res = await loginAPI(params)
      const data = res.data

      if (data.error === 0) {
        const {
          at,
          user: {apikey}
        } = data.data
        // 将at和apikey存在本地
        setLocalValue(at, apikey)
        message.success('登录成功')
        setTimeout(() => {
          navigate('/')
        }, 500)
      } else if (data.error === 10001) {
        message.error(data.msg)
      } else {
        message.error(data.msg ?? '登录失败，请检查手机号或密码')
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
