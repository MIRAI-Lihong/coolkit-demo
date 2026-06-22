import {useState, useEffect} from 'react'
import {getHomeInfoAPI} from '@/apis/home'
import type {IFamilyListResponse} from '@/types/family'
import type {IThingListResponse} from '@/types/device'

export function useHomeInfo() {
  const [familyInfo, setFamilyInfo] = useState<IFamilyListResponse | null>(null)
  const [thingInfo, setThingInfo] = useState<IThingListResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchHomeInfo = async () => {
      setLoading(true)
      const param = {
        getFamily: {},
        getThing: {
          num: 30
        }
      }
      try {
        const res = await getHomeInfoAPI(param)
        const {data} = res.data
        if (data.familyInfo) setFamilyInfo(data.familyInfo)
        if (data.thingInfo) setThingInfo(data.thingInfo)
      } catch (error) {
        console.error('获取首页信息失败', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeInfo()
  }, [])

  return {
    familyInfo,
    thingInfo,
    loading
  }
}
