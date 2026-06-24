import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import DeviceCard from '@/components/DeviceCard'
import Search from 'antd/es/input/Search'
import useFilter from './hooks/useFilter'
import ContentEmpty from './components/ContentEmpty'

interface IContentProps {
  deviceList: IThingItem[]
}

const Content = ({deviceList}: IContentProps) => {
  const {query, searchList, onSearch} = useFilter(deviceList)

  const hasQuery = query.trim().length > 0
  const shownList = searchList ?? deviceList

  if (deviceList.length === 0) {
    return <ContentEmpty type="room" />
  }

  return (
    <div className={styles.container}>
      <div className={styles.utilContainer}>
        <Search
          placeholder='搜索设备'
          allowClear
          onSearch={onSearch}
          style={{width: 200}}
        />
      </div>

      {hasQuery && shownList.length === 0 ? (
        <ContentEmpty type="search" />
      ) : (
        <div className={styles.deviceList}>
          {shownList.map(device => (
            <DeviceCard key={device.itemData.deviceid} device={device} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Content
