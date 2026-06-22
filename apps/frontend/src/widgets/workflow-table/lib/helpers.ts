import type { WorkflowStep } from '@/shared/generated/api'
import { onUnmounted, ref } from 'vue'

export function buildStepsTable(steps: WorkflowStep[]): WorkflowStep[] {
  const nodeMap = new Map(steps.map(node => [node.initialIndex, node]))

  const hasIncoming = new Set<number>()

  steps.forEach((node) => {
    node.nextSteps.forEach((next) => {
      hasIncoming.add(next)
    })
  })

  const rootNode = steps.find(node => !hasIncoming.has(node.initialIndex))
  const nodesWithoutConnections = steps.filter(node => !hasIncoming.has(node.initialIndex) && !node.nextSteps.length)

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

  return [...result, ...nodesWithoutConnections]
}

export function useMeasureTransitions() {
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

  let observer: ResizeObserver | null = null

  function setupObserver() {
    observer?.disconnect()
    observer = new ResizeObserver(() => measureTransitions())
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

  return {
    wrapperRef,
    measureTransitions,
    setupObserver,
  }
}
