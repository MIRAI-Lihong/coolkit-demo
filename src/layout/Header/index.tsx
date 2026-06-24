import {Button} from 'antd'
import styles from './index.module.less'
import {useNavigate} from 'react-router-dom'
import {removeToken} from '@/utils/token'

const Header = ({menu}: Record<string, string>) => {
  const navigate = useNavigate()
  // 跳转登录页
  const jumpLogin = () => navigate('/login')

  const logOut = () => {
    // 先把at删除掉
    removeToken()
    // 再跳转到登录页
    jumpLogin()
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
