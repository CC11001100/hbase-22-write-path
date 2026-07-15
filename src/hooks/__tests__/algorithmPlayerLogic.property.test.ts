import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  createInitialState,
  next,
  prev,
  reset,
  seek,
} from '../algorithmPlayerLogic'

describe('algorithmPlayerLogic', () => {
  it('createInitialState sets index 0 and not playing', () => {
    const s = createInitialState(10)
    expect(s.currentStepIndex).toBe(0)
    expect(s.isPlaying).toBe(false)
    expect(s.totalSteps).toBe(10)
  })

  it('next never exceeds totalSteps - 1', () => {
    const s = createInitialState(3)
    expect(next(next(next(s))).currentStepIndex).toBe(2)
    expect(next(next(next(next(s)))).currentStepIndex).toBe(2)
  })

  it('prev never goes below 0', () => {
    const s = createInitialState(3)
    expect(prev(s).currentStepIndex).toBe(0)
    expect(prev(prev(s)).currentStepIndex).toBe(0)
  })

  it('reset sets index 0 and stops', () => {
    const s = next(createInitialState(3))
    const r = reset(s)
    expect(r.currentStepIndex).toBe(0)
    expect(r.isPlaying).toBe(false)
  })

  it('seek clamps to valid range', () => {
    const s = createInitialState(5)
    expect(seek(s, 3).currentStepIndex).toBe(3)
    expect(seek(s, 100).currentStepIndex).toBe(4)
    expect(seek(s, -5).currentStepIndex).toBe(0)
  })

  it('property: next always within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 50 }),
        (total, iterations) => {
          let s = createInitialState(total)
          // 限制迭代次数上限，避免 fast-check 生成超大 nat 导致循环过久
          for (let i = 0; i < iterations; i++) s = next(s)
          return s.currentStepIndex <= total - 1 && s.currentStepIndex >= 0
        }
      )
    )
  })

  it('property: prev is idempotent at index 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (total) => {
        const s = createInitialState(total)
        // 在 index 0 处，多次 prev 仍为 0
        return prev(prev(s)).currentStepIndex === 0
      })
    )
  })

  it('property: next then prev returns to original (when not at boundary)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 100 }),
        fc.integer({ min: 0, max: 97 }),
        (total, offsetFromZero) => {
          // fromIndex 严格小于 total-1，保证 next 不被边界 clamp
          const fromIndex = Math.min(offsetFromZero, total - 2)
          let s = createInitialState(total)
          s = seek(s, fromIndex)
          return prev(next(s)).currentStepIndex === fromIndex
        }
      )
    )
  })
})
