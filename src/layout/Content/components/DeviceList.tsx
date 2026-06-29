import DeviceCard from '@/components/DeviceCard'
import type {IThingItem} from '@/types/device'
import styles from '../index.module.less'

interface IDeviceListProps {
  deviceList: IThingItem[]
  page: number
  pageSize: number
}
// 设备展示
const DeviceList = ({deviceList, page, pageSize}: IDeviceListProps) => {
  // 计算beginIndex
  const beginIndex = (page - 1) * pageSize
  // 计算endIndex 处理边界情况
  const endIndex = Math.min(beginIndex + pageSize, deviceList.length)
  const shownList = deviceList.slice(beginIndex, endIndex)

  return (
    <div className={styles.deviceList}>
      {shownList.map(device => (
        <DeviceCard key={device.itemData.deviceid} device={device} />
      ))}
    </div>
  )
}

export default DeviceList
