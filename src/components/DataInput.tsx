import type { PresetData } from '../types'
import styles from './DataInput.module.css'

interface DataInputProps {
  presets: PresetData[]
  onSelect?: (preset: PresetData) => void
}

export function DataInput({ presets, onSelect }: DataInputProps) {
  if (presets.length === 0) return null

  return (
    <div className={styles.panel}>
      <div className={styles.title}>演示场景</div>
      <div className={styles.presets}>
        {presets.map((preset, i) => (
          <button
            key={i}
            className={styles.presetBtn}
            onClick={() => onSelect?.(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className={styles.note}>选择不同场景观察该知识点的执行过程</div>
    </div>
  )
}
