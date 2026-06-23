import {useNavigate} from 'react-router-dom'
import styles from './index.module.less'
import {useHomeInfo} from './hooks/useHomeInfo'
import Sider from '@/layout/Sider'
import Loading from '@/components/Loading'

export default function Home() {
  // const navigate = useNavigate()
  // // 跳转登录
  // const jumpLogin = () => navigate('/login')

  // 获取业务状态
  const {
    loading,
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId,
    filterDeviceList
  } = useHomeInfo()

  const SiderProps = {
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId
  }

  if (loading) {
    return <Loading description='正在加载家庭信息' />
  }

  console.log(filterDeviceList)
  return (
    <div className={styles.layout}>
      <Sider {...SiderProps}></Sider>

      <div className={styles.main}></div>
    </div>
  )
}
