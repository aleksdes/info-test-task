import type { CreateStepCreatePayload } from '@/shared/generated/api'
import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useWorkflowCreateStep() {
  const apiClient = useApiClient()

  async function createFeature(stepName: string, stepColor: string, wfName: string) {
    const createData: CreateStepCreatePayload = {
      stepName,
      wfName,
      x: 0,
      y: 0,
    }

    if (stepColor) {
      createData.color = `#${stepColor}`
    }

    return await apiClient.workflow.createStepCreate(createData)
  }

  const {
    call: createStepCall,
    error: createStepError,
    loading: loadingCreateStep,
    errorMessage: createStepErrorMessage,
  } = useAsyncOperation(createFeature)

  return {
    createFeature,
    createStepCall,
    createStepError,
    loadingCreateStep,
    createStepErrorMessage,
  }
}
