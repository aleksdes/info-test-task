import type { WorkflowStep } from '@/shared/generated/api'
import { describe, expect, it, vi } from 'vitest'
import { useWorkflowCreateStep } from '../useWorkflowCreateStep'

const mockCreateStepCreate = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  useApiClient: () => ({ workflow: { createStepCreate: mockCreateStepCreate } }),
}))

const mockStep: WorkflowStep = {
  initialIndex: 0,
  name: 'TestStep',
  x: 0,
  y: 0,
  nextSteps: [],
}

describe('useWorkflowCreateStep', () => {
  it('constructs payload with color and calls API via createFeature', async () => {
    mockCreateStepCreate.mockResolvedValueOnce({ data: mockStep })

    const { createFeature } = useWorkflowCreateStep()
    const result = await createFeature('TestStep', 'ff0000', 'wf1')

    expect(mockCreateStepCreate).toHaveBeenCalledWith({
      stepName: 'TestStep',
      wfName: 'wf1',
      x: 0,
      y: 0,
      color: '#ff0000',
    })
    expect(result).toEqual({ data: mockStep })
  })

  it('constructs payload without color when stepColor is empty', async () => {
    mockCreateStepCreate.mockResolvedValueOnce({ data: { ...mockStep, name: 'NoColor' } })

    const { createFeature } = useWorkflowCreateStep()
    await createFeature('NoColor', '', 'wf1')

    expect(mockCreateStepCreate).toHaveBeenCalledWith({
      stepName: 'NoColor',
      wfName: 'wf1',
      x: 0,
      y: 0,
    })
    expect(mockCreateStepCreate.mock.calls[0][0]).not.toHaveProperty('color')
  })

  it('exposes reactive states from useAsyncOperation through createStepCall', async () => {
    mockCreateStepCreate.mockResolvedValueOnce({ data: mockStep })

    const {
      loadingCreateStep,
      createStepError,
      createStepErrorMessage,
      createStepCall,
    } = useWorkflowCreateStep()

    expect(loadingCreateStep.value).toBe(false)
    expect(createStepError.value).toBeNull()
    expect(createStepErrorMessage.value).toBeNull()

    const callPromise = createStepCall('Test', 'ffffff', 'wf1')

    expect(loadingCreateStep.value).toBe(true)

    await callPromise

    expect(loadingCreateStep.value).toBe(false)
    expect(createStepError.value).toBeNull()
    expect(createStepErrorMessage.value).toBeNull()
    expect(mockCreateStepCreate).toHaveBeenCalled()
  })

  it('handles API error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const testError = new Error('API Error')
    mockCreateStepCreate.mockRejectedValueOnce(testError)

    const {
      createStepCall,
      createStepError,
      createStepErrorMessage,
      loadingCreateStep,
    } = useWorkflowCreateStep()

    await createStepCall('Test', 'ffffff', 'wf1')

    expect(createStepError.value).toBe(testError)
    expect(createStepErrorMessage.value).toBe('API Error')
    expect(loadingCreateStep.value).toBe(false)
  })
})
