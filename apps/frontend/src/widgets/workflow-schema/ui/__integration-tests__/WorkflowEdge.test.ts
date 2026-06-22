import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkflowEdge from '../WorkflowEdge.vue'

const defaultTarget = { id: '1' }

function getEdgeSvg(props: Record<string, unknown>) {
  const wrapper = mount({
    components: { WorkflowEdge },
    template: '<svg><WorkflowEdge v-bind="props" /></svg>',
    setup() {
      return { props }
    },
    data() {
      return { props }
    },
  })
  return {
    path: wrapper.find('path').attributes('d'),
    points: wrapper.find('polygon').attributes('points'),
    html: wrapper.html(),
  }
}

describe('workflowEdge', () => {
  it('renders path and polygon elements', () => {
    const result = getEdgeSvg({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 0,
      targetNode: null,
      target: defaultTarget,
      style: { stroke: '#475569', strokeWidth: 1.5 },
    })

    expect(result.path).toBeTruthy()
    expect(result.path).toMatch(/^M\d+(\.\d+)?,\d+(\.\d+)? L\d+(\.\d+)?,\d+(\.\d+)?$/)
    expect(result.points).toBeTruthy()
  })

  it('computes path from source to target when targetNode is null', () => {
    const result = getEdgeSvg({
      sourceX: 10,
      sourceY: 20,
      targetX: 110,
      targetY: 20,
      targetNode: null,
      target: defaultTarget,
    })

    const [, endX, endY] = result.path!.match(/L([\d.]+),([\d.]+)$/)!.map(Number)
    expect(endX).toBeCloseTo(104, 0)
    expect(endY).toBe(20)
  })

  it('computes arrow polygon points', () => {
    const result = getEdgeSvg({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 0,
      targetNode: null,
      target: defaultTarget,
    })

    const points = result.points!.split(' ').map(p => p.split(',').map(Number))
    expect(points).toHaveLength(3)

    const tip = points[0]
    const bases = [points[1], points[2]]

    expect(tip[0]).toBeGreaterThan(bases[0][0])
    expect(tip[1]).toBe(0)
    expect(bases[0][1]).not.toBe(0)
  })

  it('handles vertical edge correctly', () => {
    const result = getEdgeSvg({
      sourceX: 100,
      sourceY: 0,
      targetX: 100,
      targetY: 200,
      targetNode: null,
      target: defaultTarget,
    })

    expect(result.path).toBeTruthy()
    expect(result.points).toBeTruthy()
  })

  it('uses style props for stroke attributes', () => {
    const wrapper = mount({
      components: { WorkflowEdge },
      template: '<svg><WorkflowEdge :sourceX="0" :sourceY="0" :targetX="100" :targetY="0" :targetNode="null" :target="defaultTarget" :style="{ stroke: \'#ff0000\', strokeWidth: 3 }" /></svg>',
      setup() {
        return { defaultTarget }
      },
    })

    const pathEl = wrapper.find('path')
    expect(pathEl.attributes('stroke')).toBe('#ff0000')
    expect(pathEl.attributes('stroke-width')).toBe('3')
  })
})
