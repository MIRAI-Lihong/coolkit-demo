import styles from './index.module.less'
import {useHomeInfo} from './hooks/useHomeInfo'
import Sider from '@/layout/Sider'
import Loading from '@/components/Loading'
import Header from '@/layout/Header'
import {useMemo} from 'react'
import Content from '@/layout/Content'

export default function Home() {
  // 获取业务状态
  const {
    loading,
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId,
    filterDeviceList
  } = useHomeInfo()

  const currentSelectedMenu = useMemo(() => {
    return selectedRoomId === ''
      ? '全部设备'
      : roomList.find(r => r.id === selectedRoomId)?.name
  }, [selectedRoomId, roomList])

  const SiderProps = {
    currentFamily,
    roomList,
    selectedRoomId,
    setSelectedRoomId
  }

  if (loading) {
    return <Loading description='正在加载家庭信息' />
  }

  return (
    <div className={styles.layout}>
      <Sider {...SiderProps}></Sider>

      <div className={styles.main}>
        <Header menu={currentSelectedMenu as string} />
        <Content deviceList={filterDeviceList} />
      </div>
    </div>
  )
}
