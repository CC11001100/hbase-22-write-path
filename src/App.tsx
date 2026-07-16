import { useMemo, useState } from 'react'
import { Layout } from 'antd'
import type { CodeLanguage, PresetData } from './types'
import { Header } from './components/Header'
import { DataInput } from './components/DataInput'
import { CodeDebugger } from './components/CodeDebugger'
import { Canvas } from './components/Canvas'
import { ControlPanel } from './components/ControlPanel'
import { FloatingBall } from './components/FloatingBall'
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer'
import { generateSteps } from './algorithms/stepGenerator'

// 模板占位符：生成仓库时由脚本替换为具体知识点信息
const TOPIC_TITLE = '写路径全流程'
const TOPIC_NUMBER = 22
const TOPIC_CATEGORY = '读写路径'
const REPO_NAME = 'hbase-22-write-path'
const REPO_URL = `https://github.com/hbase-hub/${REPO_NAME}`

const PRESETS: PresetData[] = [
  { label: '默认场景', data: {} },
  { label: '场景 A', data: {} },
  { label: '场景 B', data: {} },
]

const { Content } = Layout

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('java')
  const [presetIndex, setPresetIndex] = useState(0)

  const steps = useMemo(() => generateSteps(), [presetIndex])
  const [playerState, playerActions] = useAlgorithmPlayer(steps)
  const currentStep = steps[playerState.currentStepIndex] ?? steps[0]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        title={TOPIC_TITLE}
        topicNumber={TOPIC_NUMBER}
        category={TOPIC_CATEGORY}
        repoUrl={REPO_URL}
      />
      <Content style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <DataInput presets={PRESETS} onSelect={(_preset, i) => setPresetIndex(i)} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 480px',
            gap: 16,
            maxWidth: 1600,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          <div>
            <CodeDebugger
              language={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              currentLine={currentStep.currentLine}
              variables={currentStep.variables}
            />
          </div>
        </div>
      </Content>
      <FloatingBall />
    </Layout>
  )
}
