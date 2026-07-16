import { useState } from 'react'
import styles from './FloatingBall.module.css'

interface FloatingBallProps {
  hubUrl?: string
}

export function FloatingBall({ hubUrl = 'https://hbase-hub.github.io/hbase-hub/' }: FloatingBallProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      {hovered && <div className={styles.tooltip}>返回 HBase Hub 导航</div>}
      <a
        href={hubUrl}
        className={styles.ball}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="HBase Hub"
      >
        <span style={{ fontSize: 22 }}>🏠</span>
      </a>
    </>
  )
}
