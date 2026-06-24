import AuthComponent from '@/components/AuthCoponent'
import React from 'react'
import {createBrowserRouter} from 'react-router-dom'

// todo 路由鉴权，未登录的话需要跳转到登录页
const router = createBrowserRouter([
  {
    index: true,
    async lazy() {
      const {default: Home} = await import('@/pages/Home')
      return {
        Component: () =>
          React.createElement(AuthComponent, null, React.createElement(Home))
      }
    }
  },
  {
    path: '/login',
    async lazy() {
      const {default: Login} = await import('@/pages/Login')
      return {Component: Login}
    }
  }
])

export {router}
