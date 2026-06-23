import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import {Badge, Card, Switch} from 'antd'

interface IDeviceCardProps {
  device: IThingItem
}

const DeviceCard = ({device}: IDeviceCardProps) => {
  const switches = device.itemData.params.switches
  // console.log(switches)
  const toggle = () => {}

  return (
    <Card key={device.itemData.deviceid}>
      <div className={styles.deviceContainer}>
        <div className={styles.deviceContent}>
          <div className={styles.deviceName}>{device.itemData.name}</div>
          <Badge
            status={device.itemData.online ? 'success' : 'default'}
            text={device.itemData.online ? '在线' : '离线'}
          />
        </div>
        <div className={styles.deviceFoot}>
          {switches.map(() => (
            <Switch checked={false} onClick={toggle} />
          ))}
        </div>
      </div>
    </Card>
  )
}

export default DeviceCard
