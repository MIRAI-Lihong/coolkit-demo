import {Button, Card, Form, Input, message} from 'antd'
import {useState} from 'react'
import styles from './index.module.less'
import {loginAPI} from '@/apis/login'
import type {ILoginAPI} from '@/types/login'
import {setToken} from '../../utils/token'
import {useNavigate} from 'react-router-dom'

interface LoginFormValues {
  phoneNumber: string
  password: string
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (formValues: LoginFormValues) => {
    setLoading(true)

    const countryCode = '+86'
    const {phoneNumber, password} = formValues
    const params: ILoginAPI = {
      password,
      phoneNumber: countryCode + phoneNumber,
      countryCode
    }

    try {
      const res = await loginAPI(params)
      const {at} = res.data
      setToken(at)
      if (res.error === 0) {
        message.success('登录成功')
        setTimeout(() => {
          navigate('/')
        }, 500)
      } else if (res.error === 10001) {
        message.error(res.msg)
      } else {
        message.error(res.msg ?? '登录失败，请检查手机号或密码')
      }
    } catch (error) {
      console.log(error)
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card title='登录' className={styles.loginCard}>
        <Form
          name='login'
          onFinish={onFinish}
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
            <Input placeholder='手机号' />
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
