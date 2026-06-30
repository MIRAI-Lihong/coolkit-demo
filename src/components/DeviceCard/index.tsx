import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import {Badge, Card, Switch} from 'antd'
import useDevice from './hooks/useDevice'

interface IDeviceCardProps {
  device: IThingItem
}

const DeviceCard = ({device}: IDeviceCardProps) => {
  const {switches, toggle, switchLoadingMap, channelName, online} =
    useDevice(device)
  return (
    <Card key={device.itemData.deviceid}>
      <div className={styles.deviceContainer}>
        <div className={styles.deviceContent}>
          <div className={styles.deviceName}>{device.itemData.name}</div>
          {/* 展示是否在线 */}
          <Badge
            status={online ? 'success' : 'default'}
            text={online ? '在线' : '离线'}
          />
        </div>
        <div className={styles.deviceFoot}>
          {switches?.map(sw => (
            <div className={styles.switchInfo}>
              {/* 展示开关 */}
              <Switch
                key={sw.outlet}
                loading={switchLoadingMap.get(sw.outlet)}
                checked={sw.switch === 'on'}
                onChange={checked => toggle(checked, sw.outlet)}
              />
              {/* 开关名称 */}
              <div className={styles.switchName}>{channelName[sw.outlet]}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default DeviceCard
