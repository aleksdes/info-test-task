<script setup lang="ts">
import type { WorkflowStep } from '@/shared/generated/api'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, inject, nextTick, onMounted, ref, useCssModule, watch } from 'vue'
import { useWorkflow, WorkflowStep as WorkflowStepItem } from '@/entities/workflow'
import { WorkflowCreateStepFeature } from '@/features/workflow/workflow-crete-step'
import { WorkflowRemoveStepFeature } from '@/features/workflow/workflow-remove-step'
import { WorkflowUpdateNameStepFeature } from '@/features/workflow/workflow-update-name-step'
import { buildStepsTable, useMeasureTransitions } from '../lib/helpers.ts'

const workflowStore = useWorkflow()
const { workflowData, selectedStep } = storeToRefs(workflowStore)
const onRefetchWorkflow = inject<() => void>('refetchWorkflow')
const editedStep = ref<number | null>()
const styles = useCssModule()

const sortedSteps = computed(() => {
  if (!workflowData?.value?.steps)
    return []
  return buildStepsTable(workflowData.value.steps)
})

function stepNext(index: number): WorkflowStep | null {
  const step = sortedSteps.value.find(s => s.initialIndex === index) || null
  return step
}

const {
  wrapperRef,
  measureTransitions,
  setupObserver,
} = useMeasureTransitions()

onMounted(() => {
  requestAnimationFrame(() => {
    measureTransitions()
    setupObserver()
  })
})

watch(sortedSteps, () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      measureTransitions()
      setupObserver()
    })
  })
}, { deep: true })
</script>

<template>
  <div :class="styles['workflow-section-wrapper']">
    <div :class="styles['workflow-section-wrapper__header']">
      <p>Структура рабочего процесса</p>

      <WorkflowCreateStepFeature
        :workflow="workflowData"
        @refresh-workflow="onRefetchWorkflow"
      />
    </div>

    <div
      ref="wrapperRef"
      :class="styles['workflow-table-wrapper']"
    >
      <DataTable
        v-model:selection="selectedStep"
        :value="sortedSteps"
        selection-mode="single"
        data-key="initialIndex"
        scrollable
        scroll-height="flex"
        table-class="workflow-table"
      >
        <Column header="Состояние" style="max-width: 250px; width: 250px">
          <template #body="slotProps">
            <WorkflowStepItem
              v-if="editedStep !== slotProps.data.initialIndex"
              :step-data="slotProps.data"
            />

            <WorkflowUpdateNameStepFeature
              v-else
              :step="slotProps.data"
              :workflow-name="workflowData?.name || ''"
              @reset-update="editedStep = null"
            />
          </template>
        </Column>

        <Column
          field="x"
          header="x"
          style="width: 60px"
          header-class="workflow-table__col-coord-header"
          body-class="workflow-table__col-coord-body"
        />
        <Column
          field="y"
          header="y"
          style="width: 60px"
          header-class="workflow-table__col-coord-header"
          body-class="workflow-table__col-coord-body"
        />

        <Column
          header="Переходы"
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div
              :class="styles['workflow-table__transitions']"
              data-transitions
            >
              <template v-for="(target, i) in slotProps.data.nextSteps" :key="target">
                <span :class="styles['workflow-table__transitions-item']">
                  <WorkflowStepItem :step-data="stepNext(target)" />
                </span>
                <span
                  v-if="Number(i) < slotProps.data.nextSteps.length - 1"
                  :class="styles['workflow-table__transitions-sep']"
                >, </span>
              </template>
            </div>
          </template>
        </Column>

        <Column
          header=""
          style="width: 100px;"
        >
          <template #body="slotProps">
            <div class="flex flex-row items-center justify-end gap-2">
              <Button
                size="small"
                class="min-w-[32px] w-[32px] h-[32px] p-0"
                severity="secondary"
                aria-label="Редактировать состояние"
                title="Редактировать состояние"
                label=""
                @click="editedStep = slotProps.data.initialIndex"
              >
                <template #icon>
                  <FontAwesomeIcon
                    :icon="['far', 'pen-to-square']"
                  />
                </template>
              </Button>

              <WorkflowRemoveStepFeature
                :step-index="slotProps.data.initialIndex"
                :workflow-name="workflowData?.name || ''"
                @refresh-workflow="onRefetchWorkflow"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.workflow-table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.workflow-table__col-coord-header .p-datatable-column-header-content) {
  justify-content: flex-end !important;
}
:deep(.workflow-table__col-coord-body) {
  text-align: right;
}
:deep(.workflow-table thead th) {
  background-color: var(--p-surface-100);
  color: var(--p-gray-500);
}
:deep(.workflow-table tbody > tr.p-datatable-row-selected) {
  background: var(--p-gray-100);
  color: currentColor;
  border: none;
}
:deep(.workflow-table tbody > tr.p-datatable-row-selected > td) {
  border-block-end-color: transparent !important;
}
:deep(.workflow-table tbody > tr:has(+ .p-datatable-row-selected) > td) {
  border-block-end-color: transparent !important;
}
:deep(.workflow-table tbody > tr > td) {
  padding: pxToRem(8px) pxToRem(16px);
}
:deep(.workflow-table thead th) {
  padding: pxToRem(8px) pxToRem(16px);
}
</style>

<style module lang="scss">
.workflow-section-wrapper {
  height: 100%;
  width: 100%;
  overflow: auto;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: pxToRem(16px);
    font-size: pxToRem(18px);
  }
}

.workflow-table-wrapper {
  height: calc(100% - 80px);
}

.workflow-table {
  &__transitions {
    overflow: hidden;
    white-space: nowrap;
  }

  &__transitions-item {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    max-width: 100%;
  }

  &__transitions-sep {
    display: inline;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>
