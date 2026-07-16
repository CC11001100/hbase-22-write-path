import { FloatButton, Tooltip } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

interface FloatingBallProps {
  hubUrl?: string
}

export function FloatingBall({ hubUrl = 'https://hbase-hub.github.io/hbase-hub/' }: FloatingBallProps) {
  return (
    <Tooltip title="返回 HBase Hub 导航" placement="left">
      <FloatButton type="primary" icon={<HomeOutlined />} href={hubUrl} target="_blank" />
    </Tooltip>
  )
}
