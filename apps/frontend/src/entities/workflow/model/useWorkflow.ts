import type { Store } from 'pinia'
import type { GetWorkflowParams, Workflow, WorkflowStep } from '@/shared/generated/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiClient } from '@/shared/lib/api-client'

export interface IWorkflowState {
  workflowData: Workflow | null
  selectedStep: WorkflowStep | null
}

export interface IWorkflowGetters {

}

export interface IWorkflowActions {
  patch: (data: Workflow | null) => void
  fetchWorkflows: (filter: GetWorkflowParams) => Promise<Workflow | null>
  $reset: () => void
}

export interface IWorkflowStore extends Store<'workflow', IWorkflowState, IWorkflowGetters, IWorkflowActions> {}

export const useWorkflow: () => IWorkflowStore = defineStore('workflow', () => {
  const apiClient = useApiClient()

  const workflowData = ref<Workflow | null>(null)
  const selectedStep = ref<WorkflowStep | null>(null)

  function patch(data: Workflow | null) {
    workflowData.value = data
  }

  async function fetchWorkflows(filter: GetWorkflowParams): Promise<Workflow | null> {
    if (!filter.wfName)
      throw new Error('Не выбран рабочий процесс')

    const { data } = await apiClient.workflow.getWorkflow({
      wfName: filter.wfName,
    })

    patch(data)
    return data
  }

  function $reset() {
    workflowData.value = null
    selectedStep.value = null
  }

  return {
    workflowData,
    selectedStep,
    fetchWorkflows,
    patch,
    $reset,
  }
})
