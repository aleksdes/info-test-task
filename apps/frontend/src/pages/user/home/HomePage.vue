<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCssModule } from 'vue'
import { useWorkflow } from '@/entities/workflow'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { AsyncWrapper } from '@/shared/ui/async-wrapper'
import { WorkflowSchema } from '@/widgets/workflow-schema'
import { WorkflowTable } from '@/widgets/workflow-table'

const styles = useCssModule()
const workflowStore = useWorkflow()
const { fetchWorkflows } = workflowStore
const { workflowData } = storeToRefs(workflowStore)

async function getWorkflow() {
  await fetchWorkflows({
    wfName: 'wf1',
  })
}

const {
  call: refetchWorkflow,
  error: fetchWorkflowError,
  updating: updatingWorkflow,
  loading: fetchWorkflowLoading,
} = useAsyncOperation(getWorkflow, {
  immediateCall: true,
})
</script>

<template>
  <div :class="styles['home-page']">
    <div :class="styles['wrapper-card']">
      <AsyncWrapper
        :is-loading="fetchWorkflowLoading"
        :error="fetchWorkflowError"
        :is-updating="updatingWorkflow"
        loading-label="Данные рабочего процесса загружаются"
        is-loading-fixed
        is-updating-fixed
        is-error-fixed
      >
        <div v-if="workflowData" :class="styles['content-container']">
          <WorkflowTable />
          <WorkflowSchema />
        </div>

        <div v-else :class="styles['wrapper-card__empty-state']">
          <div class="flex flex-col items-center justify-center ">
            <i class="pi pi-info-circle text-blue-500" style="font-size: 2rem" />
            <span class="text-xl font-semibold">Ничего не найдено</span>
            <span class="text-base"> Попробуйте изменить запрос</span>
          </div>
        </div>
      </AsyncWrapper>
    </div>
  </div>
</template>

<style module lang="scss">
.home-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.wrapper-card {
  --card--padding: #{pxToRem(17px)} #{pxToRem(24px)};
  --card--padding-sm: #{pxToRem(18px)} #{pxToRem(18px)};

  padding: var(--card--padding-sm);
  width: 100%;
  flex: 1;
  min-height: 0;

  @media (min-width: 768px) {
    padding: var(--card--padding);
  }

  &__empty-state {
    background: var(--color-zinc-100);
    border-radius: var(--radius-2xl);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}

.content-container {
  display: grid;
  grid-template-columns: 49% 49%;
  align-self: center;
  justify-content: space-between;
  height: calc(100dvh - 40px);
  // overflow: hidden;
}
</style>
