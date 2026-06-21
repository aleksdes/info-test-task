<script setup lang="ts">
import { Handle } from '@vue-flow/core'

defineProps<{
  data: { label: string, color?: string, selected?: boolean }
}>()
</script>

<template>
  <div
    class="schema-node"
    :class="{ 'schema-node--selected': data.selected }"
    :style="{ borderColor: data.color || '#6b7280', color: data.color || 'white' }"
  >
    <span class="handle handle-top-left" />
    <span class="handle handle-top-right" />
    <span class="handle handle-bottom-left" />
    <span class="handle handle-bottom-right" />
    <span class="handle handle-top-center" />
    <span class="handle handle-bottom-center" />

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

.schema-node--selected {
  position: relative;
  background-color: #a02c2c;

  // Внешняя пунктирная рамка
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 2px dashed #222;
    pointer-events: none;
  }

  // Квадратные "ручки"
  .handle {
    position: absolute;
    width: 9px;
    height: 9px;
    background: #222;
    border: 1px solid #fff;
    z-index: 2;
  }

  // Расставляем ручки
  .handle-top-left {
    top: -10px;
    left: -10px;
  }
  .handle-top-right {
    top: -10px;
    right: -10px;
  }
  .handle-bottom-left {
    bottom: -10px;
    left: -10px;
  }
  .handle-bottom-right {
    bottom: -10px;
    right: -10px;
  }

  .handle-top-center {
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .handle-bottom-center {
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.schema-node-label {
  white-space: nowrap;
}
</style>
