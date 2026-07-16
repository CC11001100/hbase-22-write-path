import { Button, Layout, Space, Tag, Typography } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import type { HeaderProps } from '../types'

const { Header: AntHeader } = Layout
const { Title, Text } = Typography

export function Header({ title, topicNumber, category, repoUrl, backUrl, backText }: HeaderProps) {
  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Space size="middle" align="center">
        {backUrl && (
          <a href={backUrl} style={{ color: '#0a7c5a' }}>
            ← {backText ?? '返回'}
          </a>
        )}
        <Tag color="green" style={{ margin: 0, fontSize: 14, padding: '2px 10px' }}>
          #{String(topicNumber).padStart(2, '0')}
        </Tag>
        <div>
          <Title level={4} style={{ margin: 0, lineHeight: 1.2 }}>
            {title}
          </Title>
          <Text type="secondary">{category}</Text>
        </div>
      </Space>
      <Button type="link" href={repoUrl} target="_blank" icon={<GithubOutlined />}>
        GitHub
      </Button>
    </AntHeader>
  )
}
