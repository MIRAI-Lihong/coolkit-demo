import type {IThingItem} from '@/types/device'
import type {SearchProps} from 'antd/es/input'
import {useCallback, useMemo, useState} from 'react'

const useFilter = (deviceList: IThingItem[]) => {
  // 搜索框state
  const [query, setQuery] = useState<string>('')
  // 分页配置
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5
  })

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
    setPagination(prev => ({...prev, currentPage: 1}))
  }

  // 分页器改变
  const onChange = useCallback((page: number, pageSize: number) => {
    // 设置分页
    setPagination({currentPage: page, pageSize})
  }, [])

  // 重置分页以及搜索
  const resetFilter = useCallback(() => {
    setQuery('')
    setPagination({currentPage: 1, pageSize: 5})
  }, [])

  return {query, searchList, pagination, onSearch, onChange, resetFilter}
}

export default useFilter
