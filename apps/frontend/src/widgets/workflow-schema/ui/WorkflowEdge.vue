<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  targetNode: any
  style?: any
  animated?: boolean
  target: any
}>()

const PULL_BACK = 6

const endPoint = computed(() => {
  const { targetNode, sourceX, sourceY } = props

  const width = targetNode?.dimensions?.width
  const height = targetNode?.dimensions?.height
  const cp = targetNode?.computedPosition

  if (!width || !height || !cp || !isFinite(cp.x)) {
    return offsetFrom(sourceX, sourceY, props.targetX, props.targetY, PULL_BACK)
  }

  const cx = cp.x + width / 2
  const cy = cp.y + height / 2

  const dx = cx - sourceX
  const dy = cy - sourceY

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return offsetFrom(sourceX, sourceY, props.targetX, props.targetY, PULL_BACK)
  }

  const halfW = width / 2
  const halfH = height / 2
  const left = cx - halfW
  const right = cx + halfW
  const top = cy - halfH
  const bottom = cy + halfH

  let ix: number
  let iy: number
  let bestT = Infinity

  function check(x: number, y: number, t: number) {
    if (t > 0 && t < bestT) {
      ix = x; iy = y; bestT = t
    }
  }

  if (dx !== 0) {
    const tL = (left - sourceX) / dx
    const yL = sourceY + tL * dy
    if (yL >= top && yL <= bottom + 0.5) check(left, yL, tL)

    const tR = (right - sourceX) / dx
    const yR = sourceY + tR * dy
    if (yR >= top - 0.5 && yR <= bottom) check(right, yR, tR)
  }

  if (dy !== 0) {
    const tT = (top - sourceY) / dy
    const xT = sourceX + tT * dx
    if (xT >= left && xT <= right + 0.5) check(xT, top, tT)

    const tB = (bottom - sourceY) / dy
    const xB = sourceX + tB * dx
    if (xB >= left - 0.5 && xB <= right) check(xB, bottom, tB)
  }

  if (!isFinite(bestT)) {
    return offsetFrom(sourceX, sourceY, props.targetX, props.targetY, PULL_BACK)
  }

  return offsetFrom(sourceX, sourceY, ix!, iy!, PULL_BACK)
})

function offsetFrom(ox: number, oy: number, tx: number, ty: number, dist: number) {
  const dx = tx - ox
  const dy = ty - oy
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len <= dist + 0.1) return { x: tx, y: ty }
  const ratio = (len - dist) / len
  return { x: ox + dx * ratio, y: oy + dy * ratio }
}

const path = computed(() => {
  const { sourceX, sourceY } = props
  const ep = endPoint.value
  return `M${sourceX},${sourceY} L${ep.x},${ep.y}`
})

const arrowPoints = computed(() => {
  const { sourceX, sourceY } = props
  const ep = endPoint.value
  const dx = ep.x - sourceX
  const dy = ep.y - sourceY
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1)
    return ''

  const ux = dx / len
  const uy = dy / len

  const size = 8
  const width = 4

  const tipX = ep.x
  const tipY = ep.y
  const baseX = ep.x - ux * size
  const baseY = ep.y - uy * size
  const leftX = baseX - uy * width
  const leftY = baseY + ux * width
  const rightX = baseX + uy * width
  const rightY = baseY - ux * width

  return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`
})

const strokeColor = computed(() => props.style?.stroke ?? '#475569')
const strokeWidth = computed(() => props.style?.strokeWidth ?? 1.5)
</script>

<template>
  <g>
    <path
      :d="path"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
    />
    <polygon
      v-if="arrowPoints"
      :points="arrowPoints"
      :fill="strokeColor"
    />
  </g>
</template>
