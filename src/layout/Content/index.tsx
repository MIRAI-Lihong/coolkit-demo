import type {IThingItem} from '@/types/device'
import styles from './index.module.less'
import Search from 'antd/es/input/Search'
import useFilter from './hooks/useFilter'
import ContentEmpty from './components/ContentEmpty'
import {Pagination, Space} from 'antd'
import DeviceList from './components/DeviceList'
import {useEffect} from 'react'

interface IContentProps {
  deviceList: IThingItem[]
  room: string
}

const Content = ({deviceList, room}: IContentProps) => {
  const {query, searchList, pagination, onSearch, onChange, resetFilter} =
    useFilter(deviceList)

  useEffect(() => {
    // 切换房间触发重置
    resetFilter()
  }, [room, resetFilter])

  const {currentPage, pageSize} = pagination

  // 通过是否有搜索关键词表示是否在搜索
  const hasQuery = query.trim().length > 0
  const shownList = searchList ?? deviceList
  // const shownList = new Array(50).fill(shownList[0])

  if (deviceList.length === 0) {
    // 没有设备展示的空状态
    return <ContentEmpty type='room' />
  }

  return (
    <div className={styles.container}>
      <div className={styles.utilContainer}>
        <Space>
          <Search
            key={room}
            placeholder='搜索设备'
            allowClear
            onSearch={onSearch}
            style={{width: 200}}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={shownList.length}
            showTotal={total => `共 ${total} 个设备`}
            showSizeChanger
            pageSizeOptions={[5, 10, 15, 20]}
            locale={{items_per_page: '个/页'}}
            onChange={(page, pageSize) => onChange(page, pageSize)}
          />
        </Space>
      </div>

      {hasQuery && shownList.length === 0 ? (
        <ContentEmpty type='search' />
      ) : (
        <DeviceList
          deviceList={shownList}
          page={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}

export default Content
