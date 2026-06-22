import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'
import styles from './index.module.less'
import {useHomeInfo} from './hooks/useHomeInfo'

export default function Home() {
  const navigate = useNavigate()

  // 跳转登录
  const jumpLogin = () => navigate('/login')

  // 获取业务状态
  const {familyInfo, thingInfo, loading} = useHomeInfo()

  return (
    <div className={styles.container}>
      <Result
        status='success'
        title='欢迎来到首页!'
        subTitle={
          loading
            ? '正在获取家庭信息...'
            : familyInfo
              ? `当前所在家庭：${familyInfo.familyList.find(f => f.id === familyInfo.currentFamilyId)?.name || '未知'}`
              : '你已经成功登录并进入了系统首页。'
        }
        extra={[
          <Button type='primary' onClick={jumpLogin} key='logout'>
            退出登录
          </Button>
        ]}
      />

      {/* 可以在这里简单展示一下设备列表的概览 */}
      {thingInfo && thingInfo.thingList.length > 0 && (
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <h3>设备列表概览</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {thingInfo.thingList.map(item => (
              <li key={item.itemData.deviceid}>
                {item.itemData.name} ({item.itemData.online ? '在线' : '离线'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
