import type { Workflow } from '@/shared/generated/api'
import { describe, expect, it, vi } from 'vitest'
import { useWorkflowRemoveStep } from '../useWorkflowRemoveStep'

const mockDeleteStepCreate = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  useApiClient: () => ({ workflow: { deleteStepCreate: mockDeleteStepCreate } }),
}))

const mockWorkflow: Workflow = {
  name: 'wf1',
  steps: [
    { initialIndex: 0, name: 'Step0', x: 0, y: 0, nextSteps: [1] },
    { initialIndex: 2, name: 'Step2', x: 100, y: 100, nextSteps: [] },
  ],
}

describe('useWorkflowRemoveStep', () => {
  it('constructs payload correctly and calls API via deleteFeature', async () => {
    mockDeleteStepCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const { deleteFeature } = useWorkflowRemoveStep()
    const result = await deleteFeature('wf1', 2)

    expect(mockDeleteStepCreate).toHaveBeenCalledWith({
      stepInitialIndex: 2,
      wfName: 'wf1',
    })
    expect(result).toEqual({ data: mockWorkflow })
  })

  it('exposes reactive states from useAsyncOperation through deleteStep', async () => {
    mockDeleteStepCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const { loadingDeleteStep, deleteStepError, deleteStep } = useWorkflowRemoveStep()

    expect(loadingDeleteStep.value).toBe(false)
    expect(deleteStepError.value).toBeNull()

    const callPromise = deleteStep('wf1', 1)

    expect(loadingDeleteStep.value).toBe(true)

    await callPromise

    expect(loadingDeleteStep.value).toBe(false)
    expect(deleteStepError.value).toBeNull()
    expect(mockDeleteStepCreate).toHaveBeenCalledWith({
      stepInitialIndex: 1,
      wfName: 'wf1',
    })
  })

  it('handles API error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const testError = new Error('API Error')
    mockDeleteStepCreate.mockRejectedValueOnce(testError)

    const { deleteStep, deleteStepError, loadingDeleteStep } = useWorkflowRemoveStep()

    await deleteStep('wf1', 0)

    expect(deleteStepError.value).toBe(testError)
    expect(loadingDeleteStep.value).toBe(false)
  })
})
