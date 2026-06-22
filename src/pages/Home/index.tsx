import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'
import styles from './index.module.less'
import {useEffect, useState} from 'react'
import {getHomeInfoAPI} from '@/apis/home'

export default function Home() {
  const navigate = useNavigate()

  // 跳转登录
  const jumpLogin = () => navigate('/login')

  useEffect(() => {
    const getHomeInfo = async () => {
      const param = {
        getFamily: {},
        getThing: {
          num: 30
        }
      }
      const {data} = await getHomeInfoAPI(param)
      console.log(data)
    }
    getHomeInfo()
  }, [])

  return (
    <div className={styles.container}>
      <Result
        status='success'
        title='欢迎来到首页!'
        subTitle='你已经成功登录并进入了系统首页。'
        extra={[
          <Button type='primary' onClick={jumpLogin}>
            退出登录
          </Button>
        ]}
      />
    </div>
  )
}
