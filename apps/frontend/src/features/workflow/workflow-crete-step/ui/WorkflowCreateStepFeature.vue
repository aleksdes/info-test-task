<script setup lang="ts">
import type {
  WorkflowCreateStepFeatureEmits,
  WorkflowCreateStepFeatureProps,
  WorkflowCreateStepFeatureSlots,
} from './workflow-create-step-feature'
import { toTypedSchema } from '@vee-validate/zod'
import { useConfirmDialog } from '@vueuse/core'
import { vMaska } from 'maska/vue'
import Button from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import { Field, Form } from 'vee-validate'
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { z } from '@/shared/lib/zod-validate'
import { FieldMessage } from '@/shared/ui'
import { useWorkflowCreateStep } from '../model'

const props = defineProps<WorkflowCreateStepFeatureProps>()
const emits = defineEmits<WorkflowCreateStepFeatureEmits>()

defineSlots<WorkflowCreateStepFeatureSlots>()

const addStepFormRef = ref()
const { workflow } = toRefs(props)
const state = reactive({
  name: '',
  color: '',
})

const {
  createStepCall,
  createStepError,
  loadingCreateStep,
  createStepErrorMessage,
} = useWorkflowCreateStep()

const {
  reveal: _reveal,
  isRevealed,
  onCancel,
  onConfirm,
  confirm,
  cancel,
} = useConfirmDialog()

async function reveal() {
  emits('open')
  if (workflow.value) {
    state.name = `Шаг${workflow.value?.steps.length}`
    state.color = 'ffffff'
  }
  _reveal()
}

const isVisible = computed({
  get() {
    return isRevealed.value
  },
  set() {
    if (isRevealed.value)
      cancel()
    else reveal()
  },
})

function cancelHandler() {
  emits('close')
}
onCancel(cancelHandler)

function confirmHandler() {
  emits('close')
}
onConfirm(confirmHandler)

const stateSchema = z.object({
  name: z.string().min(1, 'Поле обязательно для заполнения'),
  color: z.string()
    .regex(/^[0-9a-f]{6}$/i, 'Введите HEX-цвет (6 символов)'),
})

const validationSchema = toTypedSchema(stateSchema)

async function sendForm() {
  if (!workflow.value?.name || !state.name)
    return

  await createStepCall(state.name, state.color, workflow.value?.name || '')

  if (!createStepError.value) {
    confirm()
    emits('refreshWorkflow')
  }
}
</script>

<template>
  <slot
    name="activator"
    v-bind="{
      reveal,
      isRevealed,
    }"
  >
    <Button
      size="small"
      class="create-step-activator"
      severity="secondary"
      aria-label="Создать состояние"
      title="Создать состояние"
      label="Создать состояние"
      @click="reveal"
    >
      <template #icon>
        <FontAwesomeIcon
          :icon="['fas', 'plus']"
        />
      </template>
    </Button>
  </slot>

  <Dialog
    v-model:visible="isVisible"
    modal
    header="Создание нового состояния"
    content-class="add-step-modal"
    style="max-width: 480px; width: 100%"
    :draggable="false"
    @close="cancel"
  >
    <Form
      ref="addStepFormRef"
      v-slot="{ meta }"
      class="add-step-modal__form"
      :validation-schema="validationSchema"
      @submit="sendForm"
    >
      <div class="add-step-modal__box-fields">
        <Field
          v-slot="{ errors, field }"
          v-model="state.name"
          name="name"
        >
          <FloatLabel variant="on">
            <InputText
              id="name"
              v-bind="field"
              :model-value="field.value"
              :invalid="!!errors.length"
              :disabled="loadingCreateStep"
              class="w-full"
            />
            <label for="name">Имя</label>
          </FloatLabel>

          <FieldMessage id="name-error" :errors="[...errors, createStepErrorMessage || ''].filter(Boolean)" />
        </Field>
      </div>

      <div class="add-step-modal__box-fields flex flex-row items-start justify-between gap-2">
        <div class="w-full">
          <Field
            v-slot="{ errors, field }"
            v-model="state.color"
            name="color"
          >
            <FloatLabel variant="on">
              <InputText
                id="color"
                v-bind="field"
                v-maska="{ mask: 'HHHHHH', tokens: { H: { pattern: /[0-9a-fA-F]/ } } }"
                :model-value="field.value"
                :invalid="!!errors.length"
                :disabled="loadingCreateStep"
                class="w-full"
              />
              <label for="color">Цвет</label>
            </FloatLabel>

            <FieldMessage id="color-error" :errors="errors" />
          </Field>
        </div>

        <ColorPicker v-model="state.color" inline />
      </div>

      <Button
        class="add-step-modal__send-button"
        type="submit"
        :loading="loadingCreateStep"
        aria-label="Подтвердить"
        title="Подтвердить"
        label="Подтвердить"
        :disabled="!meta.valid || loadingCreateStep"
      />
    </Form>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
