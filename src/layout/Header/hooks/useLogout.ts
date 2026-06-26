import {logoutAPI} from '@/apis/user'
import {removeAll} from '@/utils/storage'
import {message} from 'antd'
import {useNavigate} from 'react-router-dom'

const useLogout = () => {
  const navigate = useNavigate()
  // 跳转登录页
  const jumpLogin = () => navigate('/login')

  const logOut = async () => {
    try {
      // 调用退出登录
      await logoutAPI()
      // 先把at region删除掉
      removeAll()
      // 再跳转到登录页
      jumpLogin()
    } catch (error) {
      console.error(error)
      message.error('退出登录失败')
    }
  }
  return {logOut}
}

export default useLogout
