<script setup lang="ts">
import type { WorkflowStep } from '@/shared/generated/api'
import { toRefs, useCssModule } from 'vue'

const props = withDefaults(defineProps<{
  stepData?: WorkflowStep | null
}>(), {
  stepData: null,
})

const { stepData } = toRefs(props)
const styles = useCssModule()
</script>

<template>
  <div :class="styles.step">
    <FontAwesomeIcon
      :icon="['far', 'file']"
      :class="styles['step-icon']"
      :style="{ color: stepData?.color || '#6b7280' }"
    />
    <span :class="styles['step-name']">{{ stepData?.name }}</span>
  </div>
</template>

<style module lang="scss">
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
