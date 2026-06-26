import {Button} from 'antd'
import styles from './index.module.less'
import useLogout from './hooks/useLogout'

const Header = ({menu}: Record<string, string>) => {
  const {logOut} = useLogout()

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
