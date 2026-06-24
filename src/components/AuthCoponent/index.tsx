import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {message} from 'antd'
import {getToken} from '@/utils/token'

interface AuthComponentProps {
  children: React.ReactNode
}

const AuthComponent: React.FC<AuthComponentProps> = ({children}) => {
  const navigate = useNavigate()

  const hasToken = Boolean(getToken())

  useEffect(() => {
    if (!hasToken) {
      message.warning('您还没有登录')
      navigate('/login', {
        replace: true
      })
    }
  }, [hasToken, navigate])

  if (!hasToken) {
    return null
  }

  return <>{children}</>
}

export default AuthComponent
