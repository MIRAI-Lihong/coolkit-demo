import type {IThingItem} from '@/types/device'
import type {SearchProps} from 'antd/es/input'
import {useMemo, useState} from 'react'

const useFilter = (deviceList: IThingItem[]) => {
  const [query, setQuery] = useState<string>('')

  const searchList = useMemo<IThingItem[] | null>(() => {
    const v = query.trim()
    if (!v) return null

    return deviceList.filter(deviceItem => deviceItem.itemData.name.includes(v))
  }, [deviceList, query])

  const onSearch: SearchProps['onSearch'] = value => {
    setQuery(value)
  }

  return {query, searchList, onSearch}
}

export default useFilter
