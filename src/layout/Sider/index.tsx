import type {IFamily, IRoom} from '@/types/family'
import styles from './index.module.less'
import {HomeOutlined} from '@ant-design/icons'

interface ISiderProps {
  currentFamily: IFamily | undefined
  roomList: IRoom[]
  selectedRoomId: string
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string>>
}

const index = ({
  currentFamily,
  roomList,
  selectedRoomId,
  setSelectedRoomId
}: ISiderProps) => {
  return (
    <div className={styles.sider}>
      <div className={styles.homeTitle}>
        <HomeOutlined />
        {currentFamily?.name || '无家庭'}
      </div>

      <div className={styles.roomMenu}>
        <div
          className={`${styles.roomItem} ${selectedRoomId === '' ? styles.active : ''}`}
          onClick={() => setSelectedRoomId('')}
        >
          全部设备
        </div>
        {roomList.map(room => (
          <div
            key={room.id}
            className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.active : ''}`}
            onClick={() => setSelectedRoomId(room.id)}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default index
