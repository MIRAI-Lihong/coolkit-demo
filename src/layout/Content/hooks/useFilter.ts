import type {IThingItem} from '@/types/device'
import type {SearchProps} from 'antd/es/input'
import {useCallback, useMemo, useState} from 'react'

const useFilter = (deviceList: IThingItem[]) => {
  const [query, setQuery] = useState<string>('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5
  })

  const searchList = useMemo<IThingItem[] | null>(() => {
    const v = query.trim()
    if (!v) return null

    return deviceList.filter(deviceItem => deviceItem.itemData.name.includes(v))
  }, [deviceList, query])

  const onSearch: SearchProps['onSearch'] = value => {
    setQuery(value)
    setPagination(prev => ({...prev, currentPage: 1}))
  }

  const onChange = useCallback((page: number, pageSize: number) => {
    setPagination({currentPage: page, pageSize})
  }, [])

  const resetFilter = useCallback(() => {
    setQuery('')
    setPagination({currentPage: 1, pageSize: 5})
  }, [])

  return {query, searchList, pagination, onSearch, onChange, resetFilter}
}

export default useFilter
