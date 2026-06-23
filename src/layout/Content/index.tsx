import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import {Empty} from 'antd'
import DeviceCard from '@/components/DeviceCard'

interface IContentProps {
  deviceList: IThingItem[]
}

const Content = ({deviceList}: IContentProps) => {
  console.log(deviceList)
  if (!deviceList || deviceList.length === 0) {
    return (
      <div className={styles.empty}>
        <Empty description='该房间下暂无设备' />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.deviceList}>
        {deviceList.map(device => (
          <DeviceCard device={device} />
        ))}
      </div>
    </div>
  )
}

export default Content
