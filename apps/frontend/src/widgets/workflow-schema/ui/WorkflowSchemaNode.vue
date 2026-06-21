<script setup lang="ts">
import { Handle } from '@vue-flow/core'

defineProps<{
  data: { label: string, color?: string }
}>()
</script>

<template>
  <div class="schema-node" :style="{ borderColor: data.color || '#6b7280', color: data.color || '#6b7280' }">
    <Handle
      type="target"
      :position="'left' as any"
      :style="{ opacity: 0, pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }"
    />
    <span class="schema-node-label">{{ data.label }}</span>
    <Handle
      type="source"
      :position="'right' as any"
      :style="{ opacity: 0, pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }"
    />
  </div>
</template>

<style scoped lang='scss'>
.schema-node {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  max-width: 200px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.15s;
  background-color: #f9f9f9;
}

.schema-node:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.schema-node-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
