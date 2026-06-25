import {Button, message} from 'antd'
import styles from './index.module.less'
import {useNavigate} from 'react-router-dom'
import {accessTokenStorage, regionStorage} from '@/utils/storage'
import {logoutAPI} from '@/apis/user'

const Header = ({menu}: Record<string, string>) => {
  const navigate = useNavigate()
  // 跳转登录页
  const jumpLogin = () => navigate('/login')

  const removeLocal = () => {
    accessTokenStorage.remove()
    regionStorage.remove()
  }

  const logOut = async () => {
    try {
      // 调用退出登录
      await logoutAPI()
      // 先把at region删除掉
      removeLocal()
      // 再跳转到登录页
      jumpLogin()
    } catch (error) {
      console.error(error)
      message.error('退出登录失败')
    }
  }
  return (
    <div className={styles.header}>
      <h1 className={styles.name}>第二周Demo</h1>
      <div className={styles.right}>
        <h2>{menu}</h2>
        <Button type='primary' onClick={logOut}>
          退出登录
        </Button>
      </div>
    </div>
  )
}

export default Header
