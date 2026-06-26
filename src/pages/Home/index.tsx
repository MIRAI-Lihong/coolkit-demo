import styles from './index.module.less'
import {useHomeInfo} from './hooks/useHomeInfo'
import Sider from '@/layout/Sider'
import Loading from '@/components/Loading'
import Header from '@/layout/Header'
import Content from '@/layout/Content'

export default function Home() {
  const {
    loading,
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId,
    filterDeviceList,
    currentSelectedMenu
  } = useHomeInfo()

  const SiderProps = {
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId
  }

  if (loading) return <Loading description='正在加载家庭信息' />

  return (
    <div className={styles.layout}>
      <Sider {...SiderProps}></Sider>

      <div className={styles.main}>
        <Header menu={currentSelectedMenu} />
        <Content deviceList={filterDeviceList} room={selectedRoomId} />
      </div>
    </div>
  )
}
