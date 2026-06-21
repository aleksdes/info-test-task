<script setup lang="ts">
import type { SlotsType } from 'vue'
import type { WorkflowStep } from '@/shared/generated/api'
import Button from 'primevue/button'
import { toRefs } from 'vue'
import { useConfirmRemove } from '@/shared/ui'
import { useWorkflowRemoveStep } from '../model'

interface IProps {
  workflowName: string
  stepIndex: number | null
}

interface IEmits {
  (e: 'refreshWorkflow'): void
}

interface ISlots extends SlotsType {
  default: (args: {
    removeStep: () => void
  }) => any
}
const props = withDefaults(defineProps<IProps>(), {})
const emits = defineEmits<IEmits>()
defineSlots<ISlots>()

const { workflowName, stepIndex } = toRefs(props)
const { deleteStep, deleteStepError } = useWorkflowRemoveStep()
const confirmRemove = useConfirmRemove()

async function onRemoveStep() {
  if (!workflowName.value || stepIndex.value === null)
    return

  if (await confirmRemove()) {
    await deleteStep(workflowName.value, stepIndex.value)

    if (!deleteStepError.value) {
      emits('refreshWorkflow')
    }
  }
}
</script>

<template>
  <slot v-bind="{ removeStep: onRemoveStep }">
    <Button
      size="small"
      class="delete-step"
      severity="secondary"
      aria-label="Удалить состояние"
      title="Удалить состояние"
      label=""
      @click="onRemoveStep"
    >
      <template #icon>
        <FontAwesomeIcon
          :icon="['far', 'trash-can']"
        />
      </template>
    </Button>
  </slot>
</template>
