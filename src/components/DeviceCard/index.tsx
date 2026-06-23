import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import {Badge, Card} from 'antd'

interface IDeviceCardProps {
  device: IThingItem
}

const DeviceCard = ({device}: IDeviceCardProps) => {
  return (
    <Card key={device.itemData.deviceid}>
      <div className={styles.deviceContent}>
        <div className={styles.deviceName}>{device.itemData.name}</div>
        <Badge
          status={device.itemData.online ? 'success' : 'default'}
          text={device.itemData.online ? '在线' : '离线'}
        />
      </div>
    </Card>
  )
}

export default DeviceCard
