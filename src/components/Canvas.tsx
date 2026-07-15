import type { CanvasProps, VisualElement } from '../types'
import styles from './Canvas.module.css'

const STATE_COLORS: Record<string, string> = {
  idle: 'var(--color-idle)',
  active: 'var(--color-active)',
  writing: 'var(--color-writing)',
  flushing: 'var(--color-flushing)',
  done: 'var(--color-done)',
  deleted: 'var(--color-deleted)',
  error: 'var(--color-deleted)',
}

function elementColor(el: VisualElement): string {
  if (el.color) return el.color
  if (el.state && STATE_COLORS[el.state]) return STATE_COLORS[el.state]
  return 'var(--color-idle)'
}

export function Canvas({ step }: CanvasProps) {
  // 计算画布尺寸
  const maxX = step.elements.reduce((m, e) => Math.max(m, e.x + e.width), 800) + 40
  const maxY = step.elements.reduce((m, e) => Math.max(m, e.y + e.height), 400) + 40

  return (
    <div className={styles.canvas}>
      {(step.statusText || step.actionLabel) && (
        <div className={styles.statusBar}>
          {step.actionLabel && <span className={styles.actionLabel}>{step.actionLabel}</span>}
          {step.statusText && <span className={styles.statusText}>{step.statusText}</span>}
          <span className={styles.description}>{step.description}</span>
        </div>
      )}
      <svg className={styles.svg} width={maxX} height={maxY}>
        {/* 连接 */}
        {step.connections.map((c) => {
          const from = step.elements.find((e) => e.id === c.fromId)
          const to = step.elements.find((e) => e.id === c.toId)
          if (!from || !to) return null
          const x1 = from.x + from.width / 2
          const y1 = from.y + from.height / 2
          const x2 = to.x + to.width / 2
          const y2 = to.y + to.height / 2
          const color = c.color ?? 'var(--color-text-muted)'
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
                <text x={midX} y={midY - 8} className={styles.connectionLabel}>
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
              stroke="var(--color-border)"
              strokeWidth={1}
              rx={6}
              opacity={el.state === 'deleted' ? 0.5 : 1}
            />
            <text
              x={el.x + el.width / 2}
              y={el.y + el.height / 2}
              className={styles.elementLabel}
            >
              {el.label}
            </text>
            {el.subLabel && (
              <text
                x={el.x + el.width / 2}
                y={el.y + el.height - 8}
                className={styles.elementSubLabel}
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
            className={styles.calculation}
          >
            {step.calculation.expression} = {step.calculation.result}
          </text>
        )}

        {/* 注解 */}
        {step.annotations.map((a, i) => (
          <text key={i} x={a.x} y={a.y} className={styles.annotation}>
            {a.text}
          </text>
        ))}

        {/* 箭头标记定义 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted)" />
          </marker>
        </defs>
      </svg>
      {step.algorithmHint && (
        <div className={styles.statusText} style={{ marginTop: 12 }}>
          💡 {step.algorithmHint}
        </div>
      )}
    </div>
  )
}
