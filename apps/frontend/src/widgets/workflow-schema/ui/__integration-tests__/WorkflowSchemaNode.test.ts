import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import WorkflowSchemaNode from '../WorkflowSchemaNode.vue'

function renderNode(data: { label: string, color?: string, selected?: boolean }) {
  return render(WorkflowSchemaNode, {
    props: { data },
    global: {
      stubs: {
        Handle: { template: '<div data-testid="handle" />' },
      },
    },
  })
}

describe('workflowSchemaNode', () => {
  it('renders label text', () => {
    renderNode({ label: 'TestStep' })
    expect(screen.getByText('TestStep')).toBeTruthy()
  })

  it('applies color from props as border and text color', () => {
    renderNode({ label: 'Colored', color: '#ff0000' })

    const node = screen.getByText('Colored').parentElement!
    expect(node.style.borderColor).toBe('#ff0000')
    expect(node.style.color).toBe('#ff0000')
  })

  it('applies selected class when data.selected is true', () => {
    renderNode({ label: 'Selected', selected: true })

    const node = screen.getByText('Selected').parentElement!
    expect(node.className).toContain('schema-node--selected')
  })

  it('does not apply selected class when data.selected is false', () => {
    renderNode({ label: 'NotSelected', selected: false })

    const node = screen.getByText('NotSelected').parentElement!
    expect(node.className).not.toContain('schema-node--selected')
  })

  it('applies default color when color is not provided', () => {
    renderNode({ label: 'Default' })

    const node = screen.getByText('Default').parentElement!
    expect(node.style.borderColor).toBe('#6b7280')
    expect(['white', '#ffffff']).toContain(node.style.color)
  })
})
