import { useState } from 'react'
import { Card, Segmented, Typography } from 'antd'
import type { PresetData } from '../types'

const { Text } = Typography

interface DataInputProps {
  presets: PresetData[]
  onSelect?: (preset: PresetData, index: number) => void
}

export function DataInput({ presets, onSelect }: DataInputProps) {
  const [value, setValue] = useState(0)
  if (presets.length === 0) return null

  return (
    <Card size="small">
      <Segmented
        value={value}
        onChange={(idx) => {
          const i = Number(idx)
          setValue(i)
          onSelect?.(presets[i], i)
        }}
        options={presets.map((p, i) => ({ label: p.label, value: i }))}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
        选择不同场景观察该知识点的执行过程
      </Text>
    </Card>
  )
}
