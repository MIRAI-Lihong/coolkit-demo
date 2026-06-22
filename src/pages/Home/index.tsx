import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'
import styles from './index.module.less'
import {useEffect, useState} from 'react'
import {getHomeInfoAPI} from '@/apis/home'
import type {IFamilyListResponse} from '@/types/family'

// interface Home

export default function Home() {
  const navigate = useNavigate()
  const [familyList, setFamilyList] = useState<IFamilyListResponse | null>(null)

  // 跳转登录
  const jumpLogin = () => navigate('/login')

  useEffect(() => {
    const getHomeInfo = async () => {
      const param = {
        getFamily: {},
        getThing: {
          num: 30
        },
        getUser: {}
      }
      const res = await getHomeInfoAPI(param)
      const {thingInfo, familyInfo} = res.data
      const {familyList, currentFamilyId} = familyInfo
      setFamilyList({familyList, currentFamilyId})
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
