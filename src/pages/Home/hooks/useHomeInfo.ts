import {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {getHomeInfoAPI} from '@/apis/home'
import type {IFamilyListResponse} from '@/types/family'
import type {IThingItem, IThingListResponse} from '@/types/device'

export function useHomeInfo() {
  // 家庭信息
  const [familyInfo, setFamilyInfo] = useState<IFamilyListResponse | null>(null)
  // 设备信息
  const [thingInfo, setThingInfo] = useState<IThingListResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  // 左侧侧边栏选择的房间
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  // 第一页默认 -9999999
  const beginIndexMapRef = useRef<Record<number, number>>({1: -9999999})

  useEffect(() => {
    let currentRequest = true

    const doFetch = async () => {
      setLoading(true)
      const beginIndex = beginIndexMapRef.current[currentPage] ?? -9999999
      const param = {
        getFamily: {},
        getThing: {
          num: pageSize,
          beginIndex
        }
      }
      try {
        const res = await getHomeInfoAPI(param)
        if (currentRequest) {
          const {data} = res.data
          if (data.familyInfo) setFamilyInfo(data.familyInfo)
          if (data.thingInfo) {
            setThingInfo(data.thingInfo)
            const list = data.thingInfo.thingList
            // 通过上一页的最后一个设备的index 计算出下一页的beginIndex
            if (list && list.length > 0) {
              const nextBeginIndex = list[list.length - 1].index + 1
              beginIndexMapRef.current[currentPage + 1] = nextBeginIndex
            }
          }
        }
      } catch (error) {
        if (currentRequest) console.error('获取信息失败', error)
      } finally {
        if (currentRequest) setLoading(false)
      }
    }

    doFetch()

    return () => {
      currentRequest = false
    }
  }, [currentPage, pageSize])

  // 分页变化
  const onPageChange = useCallback(
    (page: number, size: number) => {
      // 当分页大小改变时也会触发 onchange
      if (size !== pageSize) {
        // 重新从第一页开始获取
        beginIndexMapRef.current = {1: -9999999}
        setPageSize(size)
        setCurrentPage(1)
      } else {
        // 常规点击上下页
        setCurrentPage(page)
      }
    },
    [pageSize]
  )

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
    // 返回设备列表
    const filterDevice = thingInfo.thingList.filter(
      thingItem => thingItem.itemData.family.roomid === selectedRoomId
    )

    return filterDevice
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
    setSelectedRoomId,
    currentPage,
    pageSize,
    onPageChange
  }
}
