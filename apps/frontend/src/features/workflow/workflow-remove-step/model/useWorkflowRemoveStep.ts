import type { DeleteStepCreatePayload } from '@/shared/generated/api'
import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useWorkflowRemoveStep() {
  const apiClient = useApiClient()

  async function deleteFeature(workflowName: string, stepIndex: number) {
    const deleteData: DeleteStepCreatePayload = {
      stepInitialIndex: stepIndex,
      wfName: workflowName,
    }

    return await apiClient.workflow.deleteStepCreate(deleteData)
  }

  const {
    call: deleteStep,
    error: deleteStepError,
    loading: loadingDeleteStep,
  } = useAsyncOperation(deleteFeature)

  return {
    deleteFeature,
    deleteStep,
    deleteStepError,
    loadingDeleteStep,
  }
}
