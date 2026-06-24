import type {IThingItem} from '@/types/device'
import type {IMessageResponse} from '@/types/websocket'
import {client} from '@/websocket/client'
import {message} from 'antd'
import {useState, useEffect} from 'react'

const useDevice = (device: IThingItem) => {
  const deviceid = device?.itemData.deviceid
  const [switches, setSwitches] = useState(device.itemData.params.switches)
  const [switchLoadingMap, setSwitchLoadingMap] = useState<
    Map<number, boolean>
  >(new Map())

  function setLoading(outlet: number, loading: boolean) {
    setSwitchLoadingMap(prev => {
      const next = new Map(prev)
      next.set(outlet, loading)
      return next
    })
  }

  const toggle = async (checked: boolean, outlet: number) => {
    setLoading(outlet, true)
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
      setLoading(outlet, false)
    } catch (error) {
      console.error(error)
      message.error('设备控制失败')
    }
  }

  useEffect(() => {
    async function fetchSwitch(deviceid: string) {
      try {
        const res = await client.query(deviceid, ['switches'])
        const newSwitches = res?.params?.switches
        if (newSwitches && newSwitches.length > 0) {
          setSwitches(newSwitches)
        }
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

  return {
    switches,
    toggle,
    switchLoadingMap
  }
}

export default useDevice
