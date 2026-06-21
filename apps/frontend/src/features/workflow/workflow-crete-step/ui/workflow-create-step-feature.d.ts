import type { Workflow } from '@/shared/generated/api'

export interface WorkflowCreateStepFeatureProps {
  workflow: Workflow | null
}

export interface WorkflowCreateStepFeatureEmits {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'refreshWorkflow'): void

}

export interface WorkflowCreateStepFeatureSlots {
  activator: (args: {
    reveal: CallableFunction
    isRevealed: boolean
  }) => void
}
