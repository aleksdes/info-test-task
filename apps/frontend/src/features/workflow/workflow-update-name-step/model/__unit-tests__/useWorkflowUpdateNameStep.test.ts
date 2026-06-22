import type { Workflow } from '@/shared/generated/api'
import { describe, expect, it, vi } from 'vitest'
import { useWorkflowUpdateNameStep } from '../useWorkflowUpdateNameStep'

const mockChangeStepNameCreate = vi.hoisted(() => vi.fn())
const mockPatch = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  useApiClient: () => ({ workflow: { changeStepNameCreate: mockChangeStepNameCreate } }),
}))

vi.mock('@/entities/workflow', () => ({
  useWorkflow: () => ({ patch: mockPatch }),
}))

const mockWorkflow: Workflow = {
  name: 'wf1',
  steps: [
    { initialIndex: 0, name: 'Step0', x: 100, y: 200, nextSteps: [] },
  ],
}

describe('useWorkflowUpdateNameStep', () => {
  it('constructs payload correctly and calls API via updateFeature', async () => {
    mockChangeStepNameCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const { updateFeature } = useWorkflowUpdateNameStep()
    await updateFeature('NewName', 0, 'wf1')

    expect(mockChangeStepNameCreate).toHaveBeenCalledWith({
      stepInitialIndex: 0,
      stepName: 'NewName',
      wfName: 'wf1',
    })
  })

  it('patches store with API response on success', async () => {
    mockChangeStepNameCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const { updateFeature } = useWorkflowUpdateNameStep()
    await updateFeature('NewName', 0, 'wf1')

    expect(mockPatch).toHaveBeenCalledWith(mockWorkflow)
  })

  it('does not patch store when API returns null data', async () => {
    mockChangeStepNameCreate.mockResolvedValueOnce({ data: null })

    const { updateFeature } = useWorkflowUpdateNameStep()
    await updateFeature('NewName', 0, 'wf1')

    expect(mockPatch).not.toHaveBeenCalled()
  })

  it('exposes reactive states from useAsyncOperation through updateNameStepCall', async () => {
    mockChangeStepNameCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const {
      updateNameStepCall,
      updateNameStepError,
      loadingUpdateNameStep,
      updateNameStepErrorMessage,
    } = useWorkflowUpdateNameStep()

    expect(loadingUpdateNameStep.value).toBe(false)
    expect(updateNameStepError.value).toBeNull()
    expect(updateNameStepErrorMessage.value).toBeNull()

    const callPromise = updateNameStepCall('Test', 0, 'wf1')

    expect(loadingUpdateNameStep.value).toBe(true)

    await callPromise

    expect(loadingUpdateNameStep.value).toBe(false)
    expect(updateNameStepError.value).toBeNull()
    expect(updateNameStepErrorMessage.value).toBeNull()
  })

  it('handles API error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const testError = new Error('API Error')
    mockChangeStepNameCreate.mockRejectedValueOnce(testError)

    const {
      updateNameStepCall,
      updateNameStepError,
      loadingUpdateNameStep,
      updateNameStepErrorMessage,
    } = useWorkflowUpdateNameStep()

    await updateNameStepCall('Test', 0, 'wf1')

    expect(updateNameStepError.value).toBe(testError)
    expect(updateNameStepErrorMessage.value).toBe('API Error')
    expect(loadingUpdateNameStep.value).toBe(false)
    expect(mockPatch).not.toHaveBeenCalled()
  })
})
