import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { Step, PlaybackRate } from '../types'
import { getPlaybackRate, savePlaybackRate } from '../utils/indexedDB'

// 可用的播放速率选项
export const PLAYBACK_RATES: PlaybackRate[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]

export interface AlgorithmPlayerState {
  currentStepIndex: number
  isPlaying: boolean
  totalSteps: number
  playbackRate: PlaybackRate
}

export interface AlgorithmPlayerActions {
  next: () => void
  prev: () => void
  play: () => void
  pause: () => void
  reset: () => void
  seek: (index: number) => void
  setPlaybackRate: (rate: PlaybackRate) => void
}

export function useAlgorithmPlayer(
  steps: Step[],
  baseInterval = 1000
): [AlgorithmPlayerState, AlgorithmPlayerActions] {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1)
  const intervalRef = useRef<number | null>(null)
  const prevStepsRef = useRef<Step[]>(steps)

  const totalSteps = steps.length

  // 从IndexedDB加载保存的播放速度
  useEffect(() => {
    getPlaybackRate().then((savedRate) => {
      if (savedRate !== null && PLAYBACK_RATES.includes(savedRate as PlaybackRate)) {
        setPlaybackRateState(savedRate as PlaybackRate)
      }
    })
  }, [])

  // 检测 steps 变化并重置状态
  const stepsChanged = steps !== prevStepsRef.current
  if (stepsChanged) {
    prevStepsRef.current = steps
  }

  const [resetCurrentStep, resetIsPlaying] = useMemo(() => {
    if (stepsChanged) {
      return [0, false]
    }
    return [currentStepIndex, isPlaying]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps])

  // 同步状态（仅在 steps 变化时）
  if (stepsChanged && (currentStepIndex !== 0 || isPlaying !== false)) {
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }

  const next = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }, [])

  const seek = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSteps - 1))
      setCurrentStepIndex(clampedIndex)
    },
    [totalSteps]
  )

  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setPlaybackRateState(rate)
    savePlaybackRate(rate)
  }, [])

  // 计算实际播放间隔（速率越高，间隔越短）
  const playInterval = baseInterval / playbackRate

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, playInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, totalSteps, playInterval])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case ' ':
          e.preventDefault()
          if (isPlaying) {
            pause()
          } else {
            play()
          }
          break
        case 'r':
        case 'R':
          e.preventDefault()
          reset()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev, play, pause, reset, isPlaying])

  const state: AlgorithmPlayerState = {
    currentStepIndex: stepsChanged ? resetCurrentStep : currentStepIndex,
    isPlaying: stepsChanged ? resetIsPlaying : isPlaying,
    totalSteps,
    playbackRate,
  }

  const actions: AlgorithmPlayerActions = {
    next,
    prev,
    play,
    pause,
    reset,
    seek,
    setPlaybackRate,
  }

  return [state, actions]
}
