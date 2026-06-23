import React from 'react'
import {Navigate} from 'react-router-dom'
import {message} from 'antd'
import {getToken} from '@/utils/token'

interface AuthComponentProps {
  children: React.ReactNode
}

const AuthComponent: React.FC<AuthComponentProps> = ({children}) => {
  const hasToken = Boolean(getToken())

  if (!hasToken) {
    message.warning('您还没有登录')
  }

  return hasToken ? <>{children}</> : <Navigate to='/login' replace />
}

export default AuthComponent
