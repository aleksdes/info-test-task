<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { VueFlow } from '@vue-flow/core'
import { storeToRefs } from 'pinia'
import { computed, markRaw } from 'vue'
import { useWorkflow } from '@/entities/workflow'
import WorkflowEdge from './WorkflowEdge.vue'
import WorkflowSchemaNode from './WorkflowSchemaNode.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const workflowStore = useWorkflow()
const { workflowData, selectedStep } = storeToRefs(workflowStore)

const sortedSteps = computed(() => {
  if (!workflowData?.value?.steps)
    return []
  return [...workflowData.value.steps].sort((a, b) => a.initialIndex - b.initialIndex)
})

const selectedIndex = computed(() => selectedStep?.value?.initialIndex ?? null)

const nodeTypes = {
  workflow: markRaw(WorkflowSchemaNode),
}

const edgeTypes = {
  'workflow-edge': markRaw(WorkflowEdge),
}

const nodes = computed(() =>
  sortedSteps.value.map(step => ({
    id: String(step.initialIndex),
    type: 'workflow',
    position: { x: step.x, y: step.y },
    data: {
      label: step.name,
      color: selectedIndex.value === step.initialIndex ? '' : step.color,
      selected: selectedIndex.value === step.initialIndex,
    },
  })),
)

const edges = computed(() => {
  const result: any[] = []
  for (const step of sortedSteps.value) {
    for (const target of step.nextSteps) {
      result.push({
        id: `e-${step.initialIndex}-${target}`,
        source: String(step.initialIndex),
        target: String(target),
        type: 'workflow-edge',
        style: { stroke: '#475569', strokeWidth: 1.5 },
        markerEnd: { type: 'arrowclosed', width: 28, height: 28, color: '#000' },
      })
    }
  }
  return result
})

const defaultViewport = { x: 0, y: 0, zoom: 1 }
</script>

<template>
  <div class="workflow-schema-wrapper">
    <VueFlow
      :nodes="nodes as any"
      :edges="edges"
      :node-types="nodeTypes as any"
      :edge-types="edgeTypes as any"
      :default-viewport="defaultViewport"
      fit-view-on-init
      :min-zoom="0.1"
      :max-zoom="2"
    >
      <Background :gap="20" />
      <Controls />
    </VueFlow>
  </div>
</template>

<style scoped lang="scss">
.workflow-schema-wrapper {
  height: 100%;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: pxToRem(8px);
  border: 1px solid #eaeaea;
  overflow: hidden;
}
</style>
