import type {IThingItem} from '@/types/device'
import type {
  IAppMsgResponse,
  IDeviceInitMsgResponse,
  IDeviceMsgResponse,
  IErrorMsgResponse,
  IOnlineMsgResponse
} from '@/types/wss'
import {client} from '@/websocket/client'
import {message} from 'antd'
import {useState, useEffect, useMemo} from 'react'

const useDevice = (device: IThingItem) => {
  const deviceid = device?.itemData.deviceid
  const [switches, setSwitches] = useState(device.itemData.params.switches)
  const [online, setOnline] = useState(device.itemData.online)
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
    if (!online) return
    // 计算新的开关数据 增量
    const params = {
      switches: [
        {
          switch: checked ? 'on' : 'off',
          outlet
        }
      ]
    }
    try {
      setLoading(outlet, true)

      // 调用ws的update方法更新数据
      const res = await client.update(deviceid, params)
      if (res.deviceid !== deviceid) return
      // 更新ui
      setSwitches(prev => {
        return prev.map(sw =>
          sw.outlet === outlet ? {...sw, switch: checked ? 'on' : 'off'} : sw
        )
      })
    } catch (error) {
      console.error(error)
      if ((error as IErrorMsgResponse).error === 504) {
        message.error('请求超时，请重试')
        return
      }
      if ((error as IErrorMsgResponse).error === 400) {
        console.error('params参数错误', params)
        return
      }
      message.error('设备控制失败')
    } finally {
      setLoading(outlet, false)
    }
  }

  // 处理开关名称
  const channelName = useMemo(() => {
    const defaultChannelName = {
      0: '通道1',
      1: '通道2',
      2: '通道3',
      3: '通道4'
    }
    return device.itemData.tags?.ck_channel_name ?? defaultChannelName
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

    // 设备上线或者离线回调
    function onlineAndOffline(data: IOnlineMsgResponse) {
      const status = data.params.online
      setOnline(status)
      if (status) {
        // 设备上线
        message.success('设备已上线')
      } else {
        // 设备下线
        message.info('设备已下线')
        setSwitches(prev => {
          return prev.map(sw => {
            return {
              ...sw,
              switch: 'off'
            }
          })
        })
      }
    }

    // 设备更新回调
    function deviceInit(data: IDeviceInitMsgResponse) {
      const {
        d_seq,
        params: {sledOnline}
      } = data
      if (d_seq && sledOnline === 'on') {
        message.success('设备联网成功,正在加载数据')
      }
    }

    client.on(`device_update:${deviceid}`, updateSwitch)
    client.on(`device_online:${deviceid}`, onlineAndOffline)
    client.on(`device_offline:${deviceid}`, onlineAndOffline)
    client.on(`device_init:${deviceid}`, deviceInit)
    return () => {
      client.off(`device_update:${deviceid}`, updateSwitch)
      client.off(`device_online:${deviceid}`, onlineAndOffline)
      client.off(`device_offline:${deviceid}`, onlineAndOffline)
      client.off(`device_init:${deviceid}`, deviceInit)
    }
  }, [deviceid])

  return {
    switches,
    toggle,
    switchLoadingMap,
    channelName,
    online
  }
}

export default useDevice
