<script setup lang="ts">
import type {
  IWorkflowUpdateNameStepFeatureEmits,
  IWorkflowUpdateNameStepFeatureProps,
} from './workflow-update-name-step-feature'
import { toTypedSchema } from '@vee-validate/zod'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { Field, Form } from 'vee-validate'
import { onMounted, ref, toRefs, useCssModule } from 'vue'
import { z } from '@/shared/lib/zod-validate'
import { useWorkflowUpdateNameStep } from '../model'

const props = withDefaults(defineProps<IWorkflowUpdateNameStepFeatureProps>(), {})
const emits = defineEmits<IWorkflowUpdateNameStepFeatureEmits>()
const styles = useCssModule()

const { step, workflowName } = toRefs(props)
const {
  updateNameStepCall,
  updateNameStepErrorMessage,
  loadingUpdateNameStep,
} = useWorkflowUpdateNameStep()

const dataForm = ref({
  name: '',
})

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
  }),
)

async function onUpdateNameStep() {
  if (!dataForm.value.name || step.value.initialIndex === null || !workflowName.value)
    return

  await updateNameStepCall(
    dataForm.value.name,
    Number(step.value.initialIndex),
    workflowName.value,
  )

  if (!updateNameStepErrorMessage.value) {
    cancelUpdate()
  }
}

function cancelUpdate() {
  emits('resetUpdate')
}

onMounted(() => {
  dataForm.value.name = step.value.name
})
</script>

<template>
  <Form
    v-slot="{ meta }"
    :class="styles['step-form']"
    :validation-schema="validationSchema"
    @submit="onUpdateNameStep"
  >
    <div>
      <Field
        v-slot="{ errors, field }"
        v-model="dataForm.name"
        name="name"
      >
        <IconField class="w-full">
          <InputText
            id="name"
            v-bind="field"
            size="small"
            :model-value="field.value"
            :invalid="!!errors.length || !!updateNameStepErrorMessage"
            class="w-full"
          />
          <InputIcon v-if="loadingUpdateNameStep" class="pi pi-spin pi-spinner" />
          <InputIcon
            v-if="!loadingUpdateNameStep && [...errors, updateNameStepErrorMessage || ''].filter(Boolean).length"
            v-tooltip="errors[0] || updateNameStepErrorMessage"
            class="pi pi-info-circle"
            style="color: red;"
          />
        </IconField>
      </Field>
    </div>

    <Button
      :disabled="!meta.valid || !!updateNameStepErrorMessage"
      size="small"
      severity="success"
      aria-label="Сохранить состояние"
      title="Сохранить состояние"
      label=""
      class="min-w-[32px] w-[32px] h-[32px] p-0"
      type="submit"
    >
      <template #icon>
        <FontAwesomeIcon
          :icon="['fas', 'check']"
        />
      </template>
    </Button>

    <Button
      size="small"
      severity="danger"
      aria-label="Отмена"
      title="Отмена"
      label=""
      class="min-w-[32px] w-[32px] h-[32px] p-0"
      @click="cancelUpdate"
    >
      <template #icon>
        <FontAwesomeIcon
          :icon="['fas', 'xmark']"
        />
      </template>
    </Button>
  </Form>
</template>

<style lang="scss" module>
.step-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: pxToRem(6px);
}
</style>
