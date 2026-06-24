import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import {Badge, Card, message, Switch} from 'antd'
import {client} from '@/websocket/client'
import {useEffect, useState} from 'react'
import type {IMessageResponse} from '@/types/websocket'

interface IDeviceCardProps {
  device: IThingItem
}

const DeviceCard = ({device}: IDeviceCardProps) => {
  const deviceid = device.itemData.deviceid
  const [switches, setSwitches] = useState(device.itemData.params.switches)

  const toggle = async (checked: boolean, outlet: number) => {
    const newSwitches = [...switches]
    newSwitches.map(sw => {
      if (sw.outlet === outlet) {
        sw.switch = checked ? 'on' : 'off'
      }
    })
    const params = {
      switches: newSwitches
    }

    try {
      const res = await client.update(deviceid, params)
      if (res.error === 0) {
        setSwitches(newSwitches)
      }
    } catch (error) {
      console.error(error)
      message.error('设备控制失败')
    }
  }

  useEffect(() => {
    async function fetchSwitch(deviceid: string) {
      try {
        const res = await client.query(deviceid)
        setSwitches(res?.params?.switches || [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchSwitch(deviceid)
  }, [deviceid])

  useEffect(() => {
    function updateSwitch(data: IMessageResponse) {
      const newSwitches = data?.params?.switches
      if (newSwitches && newSwitches.length > 0) {
        setSwitches(newSwitches)
      }
    }
    client.on('device_update', updateSwitch)
    return () => {
      client.off('device_update', updateSwitch)
    }
  }, [])

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
          {switches.map(sw => (
            <Switch
              key={sw.outlet}
              checked={sw.switch === 'on'}
              onChange={checked => toggle(checked, sw.outlet)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

export default DeviceCard
