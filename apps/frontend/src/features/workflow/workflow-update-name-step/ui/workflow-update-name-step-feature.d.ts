export interface IWorkflowUpdateNameStepFeatureProps {
  step: WorkflowStep
  workflowName: string
}

export interface IWorkflowUpdateNameStepFeatureEmits {
  (e: 'resetUpdate'): void
}
