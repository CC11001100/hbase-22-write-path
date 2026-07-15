import type { ControlPanelProps } from '../types'
import { PLAYBACK_RATES } from '../hooks/useAlgorithmPlayer'
import styles from './ControlPanel.module.css'

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
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={onReset} disabled={currentStep === 0} title="重置 (R)">
          ⏮
        </button>
        <button className={styles.btn} onClick={onPrev} disabled={currentStep === 0} title="上一步 (←)">
          ◀
        </button>
        {isPlaying ? (
          <button className={styles.btnPrimary} onClick={onPause} title="暂停 (Space)">
            ⏸ 暂停
          </button>
        ) : (
          <button
            className={styles.btnPrimary}
            onClick={onPlay}
            disabled={currentStep >= totalSteps - 1}
            title="播放 (Space)"
          >
            ▶ 播放
          </button>
        )}
        <button
          className={styles.btn}
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          title="下一步 (→)"
        >
          ▶
        </button>

        <div className={styles.progressGroup}>
          <input
            className={styles.progress}
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
          />
          <span className={styles.stepCount}>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        <div className={styles.rateGroup}>
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              className={`${styles.rateBtn} ${playbackRate === rate ? styles.rateBtnActive : ''}`}
              onClick={() => onPlaybackRateChange(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
