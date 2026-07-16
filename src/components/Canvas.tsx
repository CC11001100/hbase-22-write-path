import { Card, Space, Tag, Typography } from 'antd'
import type { CanvasProps, VisualElement } from '../types'
import {
  STATE_COLORS,
  ELEMENT_TEXT_COLOR,
  ELEMENT_BORDER_COLOR,
  CONNECTION_COLOR,
} from '../styles/theme'

const { Text } = Typography

function elementColor(el: VisualElement): string {
  if (el.color) return el.color
  if (el.state && STATE_COLORS[el.state]) return STATE_COLORS[el.state]
  return STATE_COLORS.idle
}

export function Canvas({ step }: CanvasProps) {
  const maxX = step.elements.reduce((m, e) => Math.max(m, e.x + e.width), 800) + 40
  const maxY = step.elements.reduce((m, e) => Math.max(m, e.y + e.height), 400) + 40

  return (
    <Card size="small" styles={{ body: { padding: 12 } }}>
      {(step.statusText || step.actionLabel) && (
        <Space size="small" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          {step.actionLabel && <Tag color="green">{step.actionLabel}</Tag>}
          {step.statusText && <Text type="secondary">{step.statusText}</Text>}
          <Text strong>{step.description}</Text>
        </Space>
      )}
      <div style={{ overflow: 'auto' }}>
        <svg width={maxX} height={maxY} style={{ display: 'block' }}>
          {/* 连接 */}
          {step.connections.map((c) => {
            const from = step.elements.find((e) => e.id === c.fromId)
            const to = step.elements.find((e) => e.id === c.toId)
            if (!from || !to) return null
            const x1 = from.x + from.width / 2
            const y1 = from.y + from.height / 2
            const x2 = to.x + to.width / 2
            const y2 = to.y + to.height / 2
            const color = c.color ?? CONNECTION_COLOR
            const midX = (x1 + x2) / 2 + (c.curve?.dx ?? 0)
            const midY = (y1 + y2) / 2 + (c.curve?.dy ?? 0)
            return (
              <g key={c.id}>
                {c.kind === 'contain' ? (
                  <rect
                    x={Math.min(x1, x2) - 20}
                    y={Math.min(y1, y2) - 20}
                    width={Math.abs(x2 - x1) + 40}
                    height={Math.abs(y2 - y1) + 40}
                    fill="none"
                    stroke={color}
                    strokeDasharray="4 4"
                    rx={6}
                  />
                ) : (
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />
                )}
                {c.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    fill={CONNECTION_COLOR}
                    fontSize={11}
                    textAnchor="middle"
                    fontStyle="italic"
                  >
                    {c.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* 元素 */}
          {step.elements.map((el) => (
            <g key={el.id}>
              <rect
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                fill={elementColor(el)}
                stroke={ELEMENT_BORDER_COLOR}
                strokeWidth={1}
                rx={6}
                opacity={el.state === 'deleted' ? 0.5 : 1}
              />
              <text
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                fill={ELEMENT_TEXT_COLOR}
                fontSize={13}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {el.label}
              </text>
              {el.subLabel && (
                <text
                  x={el.x + el.width / 2}
                  y={el.y + el.height - 8}
                  fill={ELEMENT_TEXT_COLOR}
                  fontSize={11}
                  textAnchor="middle"
                  opacity={0.7}
                >
                  {el.subLabel}
                </text>
              )}
            </g>
          ))}

          {/* 计算展示 */}
          {step.calculation && (
            <text
              x={step.calculation.x}
              y={step.calculation.y}
              fill="#064f3a"
              fontSize={14}
              fontFamily="SF Mono, Monaco, monospace"
              fontWeight={600}
            >
              {step.calculation.expression} = {step.calculation.result}
            </text>
          )}

          {/* 注解 */}
          {step.annotations.map((a, i) => (
            <text
              key={i}
              x={a.x}
              y={a.y}
              fill={a.color ?? '#d53f8c'}
              fontSize={12}
              fontWeight={600}
            >
              {a.text}
            </text>
          ))}

          {/* 箭头标记 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={CONNECTION_COLOR} />
            </marker>
          </defs>
        </svg>
      </div>
      {step.algorithmHint && (
        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          💡 {step.algorithmHint}
        </Text>
      )}
    </Card>
  )
}
