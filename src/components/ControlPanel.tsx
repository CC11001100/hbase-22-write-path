import { Button, Card, Segmented, Slider, Space, Typography } from 'antd'
import {
  StepBackwardOutlined,
  CaretRightOutlined,
  PauseOutlined,
  StepForwardOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ControlPanelProps } from '../types'
import { PLAYBACK_RATES } from '../hooks/useAlgorithmPlayer'

const { Text } = Typography

export function ControlPanel({
  currentStep,
  totalSteps,
  isPlaying,
  playbackRate,
  onPrev,
  onNext,
  onPlay,
  onPause,
  onReset,
  onSeek,
  onPlaybackRateChange,
}: ControlPanelProps) {
  return (
    <Card size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            disabled={currentStep === 0}
            title="重置 (R)"
          />
          <Button
            icon={<StepBackwardOutlined />}
            onClick={onPrev}
            disabled={currentStep === 0}
            title="上一步 (←)"
          />
          {isPlaying ? (
            <Button type="primary" icon={<PauseOutlined />} onClick={onPause}>
              暂停
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CaretRightOutlined />}
              onClick={onPlay}
              disabled={currentStep >= totalSteps - 1}
            >
              播放
            </Button>
          )}
          <Button
            icon={<StepForwardOutlined />}
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            title="下一步 (→)"
          />
          <Text type="secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {currentStep + 1} / {totalSteps}
          </Text>
        </Space>

        <Slider
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={(v) => onSeek(Number(v))}
          tooltip={{ formatter: (v) => `第 ${(v ?? 0) + 1} 步` }}
        />

        <div>
          <Text type="secondary" style={{ fontSize: 12, marginRight: 12 }}>
            速率
          </Text>
          <Segmented
            size="small"
            value={playbackRate}
            onChange={(r) => onPlaybackRateChange(Number(r) as ControlPanelProps['playbackRate'])}
            options={PLAYBACK_RATES.map((r) => ({ label: `${r}x`, value: r }))}
          />
        </div>
      </Space>
    </Card>
  )
}
