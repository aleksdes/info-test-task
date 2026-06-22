<script setup lang="ts">
import type {
  IWorkflowRemoveStepFeatureEmits,
  IWorkflowRemoveStepFeatureProps,
  IWorkflowRemoveStepFeatureSlots,
} from './workflow-remove-step-feature'
import Button from 'primevue/button'
import { toRefs } from 'vue'
import { useConfirmRemove } from '@/shared/ui'
import { useWorkflowRemoveStep } from '../model'

const props = withDefaults(defineProps<IWorkflowRemoveStepFeatureProps>(), {})
const emits = defineEmits<IWorkflowRemoveStepFeatureEmits>()
defineSlots<IWorkflowRemoveStepFeatureSlots>()

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
      severity="secondary"
      aria-label="Удалить состояние"
      title="Удалить состояние"
      label=""
      class="min-w-[32px] w-[32px] h-[32px] p-0"
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
