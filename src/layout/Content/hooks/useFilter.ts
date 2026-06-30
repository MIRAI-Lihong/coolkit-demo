import type {IThingItem} from '@/types/device'
import type {SearchProps} from 'antd/es/input'
import {useCallback, useMemo, useState} from 'react'

const useFilter = (deviceList: IThingItem[]) => {
  // 搜索框state
  const [query, setQuery] = useState<string>('')

  // 筛选搜索结果
  const searchList = useMemo<IThingItem[] | null>(() => {
    const v = query.trim()
    if (!v) return null

    // 通过filter过滤出符合条件的设备
    return deviceList.filter(deviceItem => deviceItem.itemData.name.includes(v))
  }, [deviceList, query])

  // 触发搜索
  const onSearch: SearchProps['onSearch'] = value => {
    setQuery(value)
  }

  // 重置搜索
  const resetFilter = useCallback(() => {
    setQuery('')
  }, [])

  return {query, searchList, onSearch, resetFilter}
}

export default useFilter
