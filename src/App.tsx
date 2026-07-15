import { useMemo, useState } from 'react'
import type { CodeLanguage, PresetData } from './types'
import { Header } from './components/Header'
import { DataInput } from './components/DataInput'
import { CodeDebugger } from './components/CodeDebugger'
import { Canvas } from './components/Canvas'
import { ControlPanel } from './components/ControlPanel'
import { FloatingBall } from './components/FloatingBall'
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer'
import { generateSteps } from './algorithms/stepGenerator'
import styles from './App.module.css'

// 模板占位符：生成仓库时由脚本替换为具体知识点信息
// 占位约定见 .kiro/specs/tasks.md：替换 {{TOPIC_TITLE}} / {{TOPIC_NUMBER}} / {{TOPIC_CATEGORY}} / {{REPO_NAME}}
const TOPIC_TITLE = '{{TOPIC_TITLE}}' // PLACEHOLDER
const TOPIC_NUMBER = 0 // PLACEHOLDER {{TOPIC_NUMBER}}
const TOPIC_CATEGORY = '{{TOPIC_CATEGORY}}' // PLACEHOLDER
const REPO_NAME = '{{REPO_NAME}}' // PLACEHOLDER
const REPO_URL = `https://github.com/CC11001100/${REPO_NAME}`

const PRESETS: PresetData[] = [
  { label: '默认场景', data: {} },
  { label: '场景 A', data: {} },
  { label: '场景 B', data: {} },
]

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('java')
  // 当前选中的预设（模板演示用，仅用于触发重新计算）
  const [presetIndex, setPresetIndex] = useState(0)

  const steps = useMemo(() => generateSteps(), [presetIndex])

  const [playerState, playerActions] = useAlgorithmPlayer(steps)

  const currentStep = steps[playerState.currentStepIndex] ?? steps[0]

  return (
    <div className={styles.app}>
      <Header
        title={TOPIC_TITLE}
        topicNumber={TOPIC_NUMBER}
        category={TOPIC_CATEGORY}
        repoUrl={REPO_URL}
      />

      <DataInput
        presets={PRESETS}
        onSelect={(preset) => setPresetIndex(PRESETS.indexOf(preset))}
      />

      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <Canvas step={currentStep} />
          <ControlPanel
            currentStep={playerState.currentStepIndex}
            totalSteps={playerState.totalSteps}
            isPlaying={playerState.isPlaying}
            playbackRate={playerState.playbackRate}
            onPrev={playerActions.prev}
            onNext={playerActions.next}
            onPlay={playerActions.play}
            onPause={playerActions.pause}
            onReset={playerActions.reset}
            onSeek={playerActions.seek}
            onPlaybackRateChange={playerActions.setPlaybackRate}
          />
        </div>
        <div className={styles.rightPanel}>
          <CodeDebugger
            language={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            currentLine={currentStep.currentLine}
            variables={currentStep.variables}
          />
        </div>
      </main>

      <FloatingBall />
    </div>
  )
}
