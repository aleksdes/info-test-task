export interface IWorkflowRemoveStepFeatureProps {
  workflowName: string
  stepIndex: number | null
}

export interface IWorkflowRemoveStepFeatureEmits {
  (e: 'refreshWorkflow'): void
}

export interface IWorkflowRemoveStepFeatureSlots extends SlotsType {
  default: (args: {
    removeStep: () => void
  }) => any
}
