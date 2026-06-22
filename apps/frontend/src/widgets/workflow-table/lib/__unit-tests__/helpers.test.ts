import type { WorkflowStep } from '@/shared/generated/api'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { buildStepsTable } from '../helpers'

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

function step(index: number, nextSteps: number[]): WorkflowStep {
  return { initialIndex: index, name: `Step${index}`, x: 0, y: 0, nextSteps }
}

describe('buildStepsTable', () => {
  it('returns empty array for empty steps', () => {
    expect(buildStepsTable([])).toEqual([])
  })

  it('returns single step with no connections (duplicated: DFS + orphans)', () => {
    const steps = [step(0, [])]
    const result = buildStepsTable(steps)
    expect(result.length).toBe(2)
    expect(result.map(s => s.initialIndex)).toEqual([0, 0])
  })

  it('orders linear chain correctly', () => {
    const steps = [step(0, [1]), step(1, [2]), step(2, [])]
    const result = buildStepsTable(steps)
    expect(result.map(s => s.initialIndex)).toEqual([0, 1, 2])
  })

  it('orders reverse linear chain', () => {
    const steps = [step(2, []), step(1, [2]), step(0, [1])]
    const result = buildStepsTable(steps)
    expect(result.map(s => s.initialIndex)).toEqual([0, 1, 2])
  })

  it('handles branching where root connects to multiple children', () => {
    const steps = [step(0, [1, 2]), step(1, []), step(2, [])]
    const result = buildStepsTable(steps)
    expect(result.length).toBe(3)
    expect(result[0].initialIndex).toBe(0)
    expect(new Set(result.map(s => s.initialIndex))).toEqual(new Set([0, 1, 2]))
  })

  it('appends orphan nodes at the end', () => {
    const steps = [step(0, [1]), step(1, []), step(5, [])]
    const result = buildStepsTable(steps)
    expect(result.length).toBe(3)
    expect(result[0].initialIndex).toBe(0)
    expect(result[1].initialIndex).toBe(1)
    expect(result[2].initialIndex).toBe(5)
  })

  it('handles diamond shape (converging branches)', () => {
    const steps = [step(0, [1, 2]), step(1, [3]), step(2, [3]), step(3, [])]
    const result = buildStepsTable(steps)
    expect(result.length).toBe(4)
    expect(result[0].initialIndex).toBe(0)
    const allIndexes = result.map(s => s.initialIndex).sort((a, b) => a - b)
    expect(allIndexes).toEqual([0, 1, 2, 3])
  })

  it('returns empty array for circular graph (no root)', () => {
    const steps = [step(0, [1]), step(1, [0])]
    expect(buildStepsTable(steps)).toEqual([])
  })
})
