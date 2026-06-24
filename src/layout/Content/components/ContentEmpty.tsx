import {Empty} from 'antd'
import styles from '../index.module.less'

interface ContentEmptyProps {
  type: 'room' | 'search'
}

const ContentEmpty = ({type}: ContentEmptyProps) => {
  const description = type === 'room' ? '该房间下暂无设备' : '未找到此设备'
  return (
    <div className={styles.empty}>
      <Empty description={description} />
    </div>
  )
}

export default ContentEmpty
