import {Button, Card, Form, Input, message} from 'antd';
import {useState} from 'react';
import styles from './index.module.less';

interface LoginFormValues {
  phone: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    console.log(values);
  };

  return (
    <div className={styles.container}>
      <Card title='系统登录' className={styles.loginCard}>
        <Form
          name='login'
          onFinish={onFinish}
          autoComplete='off'
          layout='vertical'
        >
          <Form.Item
            label='账号(手机号)'
            name='phone'
            rules={[
              {required: true, message: '请输入您的账号'},
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
  );
}
