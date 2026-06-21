<script setup lang="ts">
import type { WorkflowStep } from '@/shared/generated/api'
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  stepData?: WorkflowStep | null
}>(), {
  stepData: null,
})

const { stepData } = toRefs(props)
</script>

<template>
  <div class="step">
    <FontAwesomeIcon
      :icon="['far', 'file']"
      class="step-icon"
      :style="{ color: stepData?.color || '#6b7280' }"
    />
    <span class="step-name">{{ stepData?.name }}</span>
  </div>
</template>

<style scoped lang="scss">
.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  min-width: 0;
}

.step-icon {
  font-size: 16px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.step-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
