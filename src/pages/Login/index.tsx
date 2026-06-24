import {Button, Card, Form, Input, Select, Space} from 'antd'
import styles from './index.module.less'
import {useLogin} from './hooks/useLogin'

export default function Login() {
  const {loading, handleLogin, options} = useLogin()

  return (
    <div className={styles.container}>
      <Card title='登录' className={styles.loginCard}>
        <Form
          name='login'
          onFinish={handleLogin}
          autoComplete='off'
          layout='vertical'
        >
          <Form.Item
            label='手机号'
            name='phoneNumber'
            rules={[
              {required: true, message: '请输入您的手机号'},
              {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号'}
            ]}
          >
            <Space.Compact style={{width: '100%'}}>
              <Select
                style={{width: '50%'}}
                defaultValue={'中国(+86)'}
                options={options}
              />
              <Input style={{width: '50%'}} placeholder='手机号' />
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label='密码'
            name='password'
            rules={[{required: true, message: '请输入您的密码'}]}
          >
            <Input.Password placeholder='密码' />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              size='large'
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
