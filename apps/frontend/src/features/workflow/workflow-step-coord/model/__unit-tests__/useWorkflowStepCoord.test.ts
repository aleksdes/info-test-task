import type { Workflow } from '@/shared/generated/api'
import { describe, expect, it, vi } from 'vitest'
import { useWorkflowStepCoord } from '../useWorkflowStepCoord'

const mockChangeStepXyCreate = vi.hoisted(() => vi.fn())
const mockPatch = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  useApiClient: () => ({ workflow: { changeStepXyCreate: mockChangeStepXyCreate } }),
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

describe('useWorkflowStepCoord', () => {
  it('calls API with correct payload and patches store on success', async () => {
    mockChangeStepXyCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const { updateCoord } = useWorkflowStepCoord()
    await updateCoord({ stepInitialIndex: 0, wfName: 'wf1', x: 150, y: 250 })

    expect(mockChangeStepXyCreate).toHaveBeenCalledWith({
      stepInitialIndex: 0,
      wfName: 'wf1',
      x: 150,
      y: 250,
    })
    expect(mockPatch).toHaveBeenCalledWith(mockWorkflow)
  })

  it('does not patch store when API returns null data', async () => {
    mockChangeStepXyCreate.mockResolvedValueOnce({ data: null })

    const { updateCoord } = useWorkflowStepCoord()
    await updateCoord({ stepInitialIndex: 1, wfName: 'wf1', x: 0, y: 0 })

    expect(mockPatch).not.toHaveBeenCalled()
  })

  it('exposes reactive states from useAsyncOperation through updateCoordStepCall', async () => {
    mockChangeStepXyCreate.mockResolvedValueOnce({ data: mockWorkflow })

    const {
      updateCoordStepCall,
      updateCoordStepError,
      updateCoordStepLoading,
    } = useWorkflowStepCoord()

    expect(updateCoordStepLoading.value).toBe(false)
    expect(updateCoordStepError.value).toBeNull()

    const callPromise = updateCoordStepCall({ stepInitialIndex: 0, wfName: 'wf1', x: 0, y: 0 })

    expect(updateCoordStepLoading.value).toBe(true)

    await callPromise

    expect(updateCoordStepLoading.value).toBe(false)
    expect(updateCoordStepError.value).toBeNull()
  })

  it('handles API error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const testError = new Error('API Error')
    mockChangeStepXyCreate.mockRejectedValueOnce(testError)

    const { updateCoordStepCall, updateCoordStepError, updateCoordStepLoading } = useWorkflowStepCoord()

    await updateCoordStepCall({ stepInitialIndex: 0, wfName: 'wf1', x: 0, y: 0 })

    expect(updateCoordStepError.value).toBe(testError)
    expect(updateCoordStepLoading.value).toBe(false)
    expect(mockPatch).not.toHaveBeenCalled()
  })
})
