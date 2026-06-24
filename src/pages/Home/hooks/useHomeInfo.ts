import {useState, useEffect, useMemo} from 'react'
import {getHomeInfoAPI} from '@/apis/home'
import type {IFamilyListResponse} from '@/types/family'
import type {IThingItem, IThingListResponse} from '@/types/device'

export function useHomeInfo() {
  // 家庭信息
  const [familyInfo, setFamilyInfo] = useState<IFamilyListResponse | null>(null)
  // 设备信息
  const [thingInfo, setThingInfo] = useState<IThingListResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  useEffect(() => {
    // 获取家庭信息
    const fetchHomeInfo = async () => {
      setLoading(true)
      // 家庭信息参数
      const param = {
        getFamily: {},
        getThing: {}
      }
      try {
        const res = await getHomeInfoAPI(param)
        const {data} = res.data
        if (data.familyInfo) setFamilyInfo(data.familyInfo)
        if (data.thingInfo) setThingInfo(data.thingInfo)
      } catch (error) {
        console.error('获取信息失败', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeInfo()
  }, [])

  // 当前家庭
  const currentFamily = useMemo(() => {
    if (!familyInfo) return
    // 判断当前家庭
    return familyInfo.familyList.find(
      fm => fm.id === familyInfo.currentFamilyId
    )
  }, [familyInfo])

  // 当前家庭下的 room 列表
  const roomList = useMemo(() => {
    return currentFamily?.roomList || []
  }, [currentFamily])

  // 筛选设备
  const filterDeviceList = useMemo(() => {
    const result: IThingItem[] = []
    if (!thingInfo) return result
    // 没有selectedRoomId 返回全部设备
    if (!selectedRoomId) return thingInfo.thingList || result
    const filterDevice = thingInfo.thingList.find(
      thingItem => thingItem.itemData.family.roomid === selectedRoomId
    )
    if (Array.isArray(filterDevice)) {
      return filterDevice
    } else if (filterDevice !== undefined) {
      result.push(filterDevice)
    }

    return result
  }, [thingInfo, selectedRoomId])

  // 当前选择房间
  const currentSelectedMenu = useMemo(() => {
    return selectedRoomId === ''
      ? '全部设备'
      : (roomList.find(r => r.id === selectedRoomId)?.name ?? '')
  }, [selectedRoomId, roomList])

  return {
    familyInfo,
    thingInfo,
    loading,
    currentFamily,
    roomList,
    selectedRoomId,
    filterDeviceList,
    currentSelectedMenu,
    setSelectedRoomId
  }
}
