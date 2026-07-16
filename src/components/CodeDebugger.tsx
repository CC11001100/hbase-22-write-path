import { useState } from 'react'
import { Card, Descriptions, Empty, Tabs, Typography } from 'antd'
import type { CodeDebuggerProps, CodeLanguage } from '../types'
import { highlightCode, splitCodeLines } from '../utils/syntaxHighlight'
import { TEMPLATE_CODE } from '../algorithms/stepGenerator'

const { Text } = Typography

const LANGUAGES: CodeLanguage[] = ['java', 'python', 'golang', 'javascript', 'shell']
const LANG_LABEL: Record<CodeLanguage, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JS',
  shell: 'Shell',
}

const codeAreaStyle: React.CSSProperties = {
  margin: 0,
  padding: '8px 0',
  fontFamily: 'SF Mono, Monaco, Consolas, monospace',
  fontSize: 13,
  lineHeight: 1.7,
  overflowX: 'auto',
}

export function CodeDebugger({
  language,
  onLanguageChange,
  currentLine,
  variables,
}: CodeDebuggerProps) {
  const [code] = useState(TEMPLATE_CODE)
  const lines = splitCodeLines(code)
  const highlighted = lines.map((line) => highlightCode(line || ' ', language))

  const codeItems = [
    {
      key: 'code',
      label: '源码',
      children: (
        <pre style={codeAreaStyle}>
          {highlighted.map((html, i) => {
            const lineNo = i + 1
            const isActive = lineNo === currentLine
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  minWidth: 'max-content',
                  background: isActive ? 'rgba(245,173,85,0.20)' : 'transparent',
                  borderLeft: isActive ? '3px solid #f6ad55' : '3px solid transparent',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 40,
                    paddingRight: 12,
                    textAlign: 'right',
                    color: isActive ? '#d97706' : '#a0aec0',
                    userSelect: 'none',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {lineNo}
                </span>
                <span
                  style={{ paddingRight: 16, whiteSpace: 'pre' }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )
          })}
        </pre>
      ),
    },
  ]

  return (
    <Card
      size="small"
      title={
        <Tabs
          size="small"
          activeKey={language}
          onChange={(k) => onLanguageChange(k as CodeLanguage)}
          items={LANGUAGES.map((lang) => ({ key: lang, label: LANG_LABEL[lang] }))}
        />
      }
      styles={{ header: { borderBottom: 'none' } }}
    >
      <Tabs items={codeItems} size="small" />
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 4 }}>
        <Text
          type="secondary"
          style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          变量状态
        </Text>
        {variables.length === 0 ? (
          <Empty description="—" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '8px 0' }} />
        ) : (
          <Descriptions column={1} size="small" style={{ marginTop: 6 }}>
            {variables.map((v, i) => (
              <Descriptions.Item
                key={i}
                label={
                  <Text strong style={{ color: '#0a7c5a', fontFamily: 'SF Mono, Monaco, monospace' }}>
                    {v.name}
                    {v.type ? (
                      <Text type="secondary" style={{ fontWeight: 400, fontSize: 11 }}>
                        {' '}
                        ({v.type})
                      </Text>
                    ) : null}
                  </Text>
                }
              >
                <span style={{ fontFamily: 'SF Mono, Monaco, monospace' }}>= {v.value}</span>
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </div>
    </Card>
  )
}
