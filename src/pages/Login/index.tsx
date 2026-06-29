import {Button, Card, Form, Input, Select, Space, Tabs} from 'antd'
import {useState} from 'react'
import styles from './index.module.less'
import {useLogin} from './hooks/useLogin'

export default function Login() {
  const {loading, handleLogin, options} = useLogin()
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone')

  return (
    <div className={styles.container}>
      <Card title='账号登录' className={styles.loginCard}>
        <Tabs
          activeKey={loginType}
          onChange={key => setLoginType(key as 'phone' | 'email')}
          items={[
            {key: 'phone', label: '手机号'},
            {key: 'email', label: '邮箱'}
          ]}
        />
        <Form
          name='login'
          onFinish={values => handleLogin({...values, loginType})}
          autoComplete='off'
          layout='vertical'
          initialValues={{countryCode: '+86'}}
        >
          {loginType === 'phone' && (
            <Form.Item label='手机号'>
              <Space.Compact style={{width: '100%'}}>
                <Form.Item
                  name='countryCode'
                  noStyle
                  rules={[{required: true, message: '请选择区号'}]}
                >
                  <Select style={{width: '40%'}} options={options} />
                </Form.Item>

                <Form.Item
                  name='phoneNumber'
                  noStyle
                  rules={[
                    {required: true, message: '请输入您的手机号'},
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确的手机号'
                    }
                  ]}
                >
                  <Input style={{width: '60%'}} placeholder='手机号' />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          )}

          {loginType === 'email' && (
            <>
              <Form.Item name='countryCode' hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label='邮箱'
                name='email'
                rules={[
                  {required: true, message: '请输入您的邮箱'},
                  {type: 'email', message: '请输入正确的邮箱格式'}
                ]}
              >
                <Input placeholder='邮箱' />
              </Form.Item>
            </>
          )}

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
