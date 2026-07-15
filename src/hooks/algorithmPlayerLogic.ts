/**
 * 算法播放器的纯函数逻辑，用于属性测试
 */

export interface PlayerState {
  currentStepIndex: number
  isPlaying: boolean
  totalSteps: number
}

export function createInitialState(totalSteps: number): PlayerState {
  return {
    currentStepIndex: 0,
    isPlaying: false,
    totalSteps,
  }
}

export function next(state: PlayerState): PlayerState {
  return {
    ...state,
    currentStepIndex: Math.min(state.currentStepIndex + 1, state.totalSteps - 1),
  }
}

export function prev(state: PlayerState): PlayerState {
  return {
    ...state,
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
  }
}

export function play(state: PlayerState): PlayerState {
  return { ...state, isPlaying: true }
}

export function pause(state: PlayerState): PlayerState {
  return { ...state, isPlaying: false }
}

export function reset(state: PlayerState): PlayerState {
  return { ...state, currentStepIndex: 0, isPlaying: false }
}

export function seek(state: PlayerState, index: number): PlayerState {
  const clampedIndex = Math.max(0, Math.min(index, state.totalSteps - 1))
  return { ...state, currentStepIndex: clampedIndex }
}
