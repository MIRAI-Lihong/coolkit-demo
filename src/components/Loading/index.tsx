import {LoadingOutlined} from '@ant-design/icons'
import styles from './index.module.less'
import {Spin} from 'antd'

interface ILoadingProps {
  description: string
}

const index = ({description}: ILoadingProps) => {
  const contentStyle: React.CSSProperties = {
    minWidth: 300
  }
  const content = <div style={contentStyle} />
  return (
    <div className={styles.loading}>
      <Spin
        description={description}
        indicator={<LoadingOutlined style={{fontSize: 48}} spin />}
      >
        {content}
      </Spin>
    </div>
  )
}

export default index
