import type { ChangeStepXyCreatePayload } from '@/shared/generated/api'
import { useWorkflow } from '@/entities/workflow'
import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useWorkflowStepCoord() {
  const apiClient = useApiClient()
  const { patch } = useWorkflow()

  async function updateCoord(dataStep: ChangeStepXyCreatePayload) {
    const { data } = await apiClient.workflow.changeStepXyCreate(dataStep)

    if (data) {
      patch(data)
    }
  }

  const {
    call: updateCoordStepCall,
    error: updateCoordStepError,
    loading: updateCoordStepLoading,
  } = useAsyncOperation(updateCoord)

  return {
    updateCoord,
    updateCoordStepCall,
    updateCoordStepError,
    updateCoordStepLoading,
  }
}
