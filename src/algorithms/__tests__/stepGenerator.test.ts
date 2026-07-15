import { describe, it, expect } from 'vitest'
import { generateSteps } from '../stepGenerator'

describe('stepGenerator (template example)', () => {
  it('returns at least one step', () => {
    const steps = generateSteps()
    expect(steps.length).toBeGreaterThan(0)
  })

  it('every step has required fields', () => {
    for (const step of generateSteps()) {
      expect(typeof step.index).toBe('number')
      expect(typeof step.description).toBe('string')
      expect(Array.isArray(step.elements)).toBe(true)
      expect(Array.isArray(step.variables)).toBe(true)
      expect(Array.isArray(step.connections)).toBe(true)
    }
  })

  it('step indices are sequential starting from 0', () => {
    const steps = generateSteps()
    steps.forEach((s, i) => expect(s.index).toBe(i))
  })

  it('element ids are unique within a step', () => {
    for (const step of generateSteps()) {
      const ids = step.elements.map((e) => e.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    }
  })
})
