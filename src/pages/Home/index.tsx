import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // 跳转登录
  const jumpLogin = () => navigate('/login');

  return (
    <div style={{padding: '50px'}}>
      <Result
        status='success'
        title='欢迎来到首页!'
        subTitle='你已经成功登录并进入了系统首页。'
        extra={[
          <Button type='primary' onClick={jumpLogin}>
            退出登录
          </Button>
        ]}
      />
    </div>
  );
}
