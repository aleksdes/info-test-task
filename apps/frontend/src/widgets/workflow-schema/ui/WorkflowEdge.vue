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

interface Point { x: number; y: number }

function lineRectIntersection(
  sx: number, sy: number,
  tx: number, ty: number,
  rx: number, ry: number,
  rw: number, rh: number,
): Point {
  const dx = tx - sx
  const dy = ty - sy
  if (dx === 0 && dy === 0) return { x: tx, y: ty }

  const halfW = rw / 2
  const halfH = rh / 2
  const left = rx - halfW
  const right = rx + halfW
  const top = ry - halfH
  const bottom = ry + halfH

  let best: Point | null = null
  let bestT = Infinity

  function check(x: number, y: number, t: number) {
    if (t > 0 && t < bestT) { best = { x, y }; bestT = t }
  }

  if (dx !== 0) {
    const tL = (left - sx) / dx; const yL = sy + tL * dy
    if (yL >= top && yL <= bottom) check(left, yL, tL)
    const tR = (right - sx) / dx; const yR = sy + tR * dy
    if (yR >= top && yR <= bottom) check(right, yR, tR)
  }
  if (dy !== 0) {
    const tT = (top - sy) / dy; const xT = sx + tT * dx
    if (xT >= left && xT <= right) check(xT, top, tT)
    const tB = (bottom - sy) / dy; const xB = sx + tB * dy
    if (xB >= left && xB <= right) check(xB, bottom, tB)
  }
  return best || { x: tx, y: ty }
}

const endPoint = computed(() => {
  const { targetNode, sourceX, sourceY } = props
  const { width, height } = targetNode?.dimensions ?? {}

  if (!width || !height) {
    return { x: props.targetX, y: props.targetY }
  }

  const cp = targetNode.computedPosition
  const centerX = cp.x + width / 2
  const centerY = cp.y + height / 2
  return lineRectIntersection(sourceX, sourceY, centerX, centerY, centerX, centerY, width, height)
})

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
  if (len < 1) return ''

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
