import type {IThingItem} from '@/types/device'
import type {IAppMsgResponse, IDeviceMsgResponse} from '@/types/wss'
import {client} from '@/websocket/client'
import {message} from 'antd'
import {useState, useEffect, useMemo} from 'react'

const useDevice = (device: IThingItem) => {
  const deviceid = device?.itemData.deviceid
  const [switches, setSwitches] = useState(device.itemData.params.switches)
  console.log(switches)
  const [switchLoadingMap, setSwitchLoadingMap] = useState<
    Map<number, boolean>
  >(new Map())

  // 设置每个开关的loading
  function setLoading(outlet: number, loading: boolean) {
    setSwitchLoadingMap(prev => {
      const next = new Map(prev)
      next.set(outlet, loading)
      return next
    })
  }

  // 开关切换处理
  const toggle = async (checked: boolean, outlet: number) => {
    setLoading(outlet, true)
    // 计算新的开关数据
    const newSwitches = [...switches]
    newSwitches.map(sw => {
      if (sw.outlet === outlet) {
        sw.switch = checked ? 'on' : 'off'
      }
    })

    // 处理参数
    const params = {
      switches: newSwitches
    }

    try {
      // 调用ws的update方法更新数据 和查询数据逻辑类似
      const res = await client.update(deviceid, params)
      if (res.deviceid === deviceid) {
        // 更新ui
        setSwitches(newSwitches)
      }
      setLoading(outlet, false)
    } catch (error) {
      console.error(error)
      message.error('设备控制失败')
    }
  }

  // 处理开关名称
  const channelName = useMemo(() => {
    return Object.entries(device.itemData.tags.ck_channel_name).map(
      ([key, value]) => {
        return {
          key,
          value
        }
      }
    )
  }, [device])

  useEffect(() => {
    // 设备更新回调
    function updateSwitch(data: IAppMsgResponse | IDeviceMsgResponse) {
      // 更新state，同步ui
      const newSwitches = data?.params?.switches
      if (newSwitches && newSwitches.length > 0) {
        setSwitches(newSwitches)
      }
    }
    // 开启设备更新的监听
    client.on('device_update', updateSwitch)
    return () => {
      client.off('device_update', updateSwitch)
    }
  }, [])

  return {
    switches,
    toggle,
    switchLoadingMap,
    channelName
  }
}

export default useDevice
