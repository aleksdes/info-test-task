import type { ChangeStepNameCreatePayload, DeleteStepCreatePayload, WorkflowStep } from '@/shared/generated/api'
import { useWorkflow } from '@/entities/workflow'
import { useApiClient } from '@/shared/lib/api-client'
import { useAsyncOperation } from '@/shared/lib/async-operation'

export function useWorkflowUpdateNameStep() {
  const apiClient = useApiClient()

  const { patch } = useWorkflow()

  async function updateFeature(stepName: string, stepIndex: number, wfName: string) {
    const updateData: ChangeStepNameCreatePayload = {
      stepInitialIndex: stepIndex,
      stepName,
      wfName,
    }

    const { data } = await apiClient.workflow.changeStepNameCreate(updateData)

    if (data) {
      patch(data)
    }
  }

  const {
    call: updateNameStepCall,
    error: updateNameStepError,
    loading: loadingUpdateNameStep,
    errorMessage: updateNameStepErrorMessage,
  } = useAsyncOperation(updateFeature)

  return {
    updateFeature,
    updateNameStepCall,
    updateNameStepError,
    loadingUpdateNameStep,
    updateNameStepErrorMessage,
  }
}
