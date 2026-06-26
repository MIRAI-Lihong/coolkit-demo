import DeviceCard from '@/components/DeviceCard'
import type {IThingItem} from '@/types/device'
import styles from '../index.module.less'

interface IDeviceListProps {
  deviceList: IThingItem[]
  page: number
  pageSize: number
}

const DeviceList = ({deviceList, page, pageSize}: IDeviceListProps) => {
  const beginIndex = (page - 1) * pageSize
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
