<script setup lang="ts">
import type { WorkflowStep } from '@/shared/generated/api'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, inject, nextTick, onMounted, onUnmounted, ref, useCssModule, watch } from 'vue'
import { useWorkflow, WorkflowStep as WorkflowStepItem } from '@/entities/workflow'
import { WorkflowCreateStepFeature } from '@/features/workflow/workflow-crete-step'
import { WorkflowRemoveStepFeature } from '@/features/workflow/workflow-remove-step'
import { WorkflowUpdateNameStepFeature } from '@/features/workflow/workflow-update-name-step'

const workflowStore = useWorkflow()
const { workflowData, selectedStep } = storeToRefs(workflowStore)
const onRefetchWorkflow = inject<() => void>('refetchWorkflow')
const editedStep = ref<number | null>()

function buildStepsTable(steps: WorkflowStep[]): WorkflowStep[] {
  const nodeMap = new Map(steps.map(node => [node.initialIndex, node]))

  const hasIncoming = new Set<number>()

  steps.forEach((node) => {
    node.nextSteps.forEach((next) => {
      hasIncoming.add(next)
    })
  })

  const rootNode = steps.find(node => !hasIncoming.has(node.initialIndex))

  if (!rootNode) {
    console.warn('Корневой узел не найден')
    return []
  }

  const visited = new Set<number>()
  const result: WorkflowStep[] = []

  function dfs(nodeIndex: number) {
    if (visited.has(nodeIndex))
      return

    const node = nodeMap.get(nodeIndex)
    if (!node)
      return

    const stepsReverse = [...node.nextSteps].reverse()

    for (const nextIndex of stepsReverse) {
      dfs(nextIndex)
    }

    if (!visited.has(nodeIndex)) {
      visited.add(nodeIndex)
      result.unshift(node)
    }
  }

  dfs(rootNode.initialIndex)

  return result
}

const sortedSteps = computed(() => {
  if (!workflowData?.value?.steps)
    return []
  return buildStepsTable(workflowData.value.steps)
})

function stepNext(index: number): WorkflowStep | null {
  const step = sortedSteps.value.find(s => s.initialIndex === index) || null
  return step
}

const styles = useCssModule()
const wrapperRef = ref<HTMLElement | null>(null)

function measureTransitions() {
  if (!wrapperRef.value)
    return
  for (const container of wrapperRef.value.querySelectorAll<HTMLElement>('[data-transitions]')) {
    const children = Array.from(container.children) as HTMLElement[]

    for (const child of children) {
      child.style.removeProperty('display')
      child.style.removeProperty('max-width')
    }

    const containerWidth = container.clientWidth
    let accWidth = 0
    let overflowIdx = -1

    for (let i = 0; i < children.length; i++) {
      const w = children[i].offsetWidth
      if (accWidth + w > containerWidth && overflowIdx === -1) {
        overflowIdx = i
      }
      accWidth += w
    }

    if (overflowIdx === -1)
      continue

    for (let i = overflowIdx + 1; i < children.length; i++) {
      children[i].style.display = 'none'
    }

    accWidth = 0
    for (let i = 0; i < overflowIdx; i++) {
      accWidth += children[i].offsetWidth
    }
    children[overflowIdx].style.maxWidth = `${containerWidth - accWidth}px`
  }
}

watch(sortedSteps, () => {
  setTimeout(() => {
    measureTransitions()
    setupObserver()
  }, 100)
}, { deep: true, immediate: true })

let observer: ResizeObserver | null = null

function setupObserver() {
  observer?.disconnect()
  observer = new ResizeObserver(() => nextTick(measureTransitions))
  if (!wrapperRef.value)
    return
  observer.observe(wrapperRef.value)
  const dtWrapper = wrapperRef.value.querySelector<HTMLElement>('.p-datatable')

  if (dtWrapper)
    observer.observe(dtWrapper)
  for (const el of wrapperRef.value.querySelectorAll<HTMLElement>('[data-transitions]')) {
    observer.observe(el)
  }
}

onUnmounted(() => {
  observer?.disconnect()
})
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

    <div ref="wrapperRef" :class="styles['workflow-table-wrapper']">
      <DataTable
        ref="wrapperRef"
        v-model:selection="selectedStep"
        :value="sortedSteps"
        selection-mode="single"
        data-key="initialIndex"
        scrollable
        scroll-height="flex"
        table-class="workflow-table"
      >
        <Column header="Состояние" style="max-width: 250px">
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
          header-class="workflow-table__col-coord-header"
          body-class="workflow-table__col-coord-body"
        />
        <Column
          field="y"
          header="y"
          header-class="workflow-table__col-coord-header"
          body-class="workflow-table__col-coord-body"
        />

        <Column
          header="Переходы"
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
        >
          <template #body="slotProps">
            <div class="flex flex-row items-center justify-end gap-2">
              <Button
                size="small"
                class="delete-step"
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
:deep(.workflow-table__col-coord-header .p-datatable-column-header-content) {
  justify-content: flex-end !important;
}
:deep(.workflow-table__col-coord-body) {
  text-align: right;
}
:deep(.workflow-table thead th) {
  background-color: var(--color-gray-100);
  color: var(--color-gray-500);
}
:deep(.workflow-table tbody > tr.p-datatable-row-selected) {
  background: var(--color-gray-100);
  color: currentColor;
  border: none;
}
:deep(.workflow-table tbody > tr > td) {
  border-block-end-color: transparent !important;
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
    font-size: pxToRem(16px);
  }
}

.workflow-table-wrapper {
  height: calc(100% - 80px);
}

.workflow-table {
  &__transitions {
    overflow: hidden;
    white-space: nowrap;
    max-width: pxToRem(250px);
  }

  &__transitions-item {
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;
    max-width: 100%;
    overflow: hidden;
  }

  &__transitions-sep {
    display: inline;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>
