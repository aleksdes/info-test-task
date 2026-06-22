import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { http, HttpResponse } from 'msw'
import PrimeVue from 'primevue/config'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/shared/test/testing/msw/server'
import WorkflowRemoveStepFeature from '../WorkflowRemoveStepFeature.vue'

const mockConfirmRemove = vi.hoisted(() => vi.fn())

vi.mock('@/shared/ui', () => ({
  useConfirmRemove: () => mockConfirmRemove,
}))

const API_BASE = 'http://test.local'
const WORKFLOW_MOCK = {
  name: 'wf1',
  steps: [
    { initialIndex: 0, name: 'Step0', x: 0, y: 0, nextSteps: [1] },
    { initialIndex: 2, name: 'Step2', x: 100, y: 100, nextSteps: [] as number[] },
  ],
}

beforeAll(() => {
  vi.stubEnv('VITE_API_TARGET', API_BASE)
})

afterAll(() => {
  vi.unstubAllEnvs()
})

function renderComponent(props?: Record<string, unknown>) {
  return render(WorkflowRemoveStepFeature, {
    props: {
      workflowName: 'wf1',
      stepIndex: 0,
      ...props,
    },
    global: {
      components: {
        FontAwesomeIcon: { template: '<span data-testid="fa-icon" />' },
      },
      plugins: [PrimeVue],
    },
  })
}

describe('workflowRemoveStepFeature', () => {
  beforeEach(() => {
    server.use(
      http.post(`${API_BASE}/workflow/deleteStep`, () => {
        return HttpResponse.json(WORKFLOW_MOCK)
      }),
    )
  })

  it('renders button with correct aria-label', () => {
    renderComponent()
    const button = screen.getByRole('button', { name: 'Удалить состояние' })
    expect(button).toBeTruthy()
  })

  it('calls API and emits refreshWorkflow when confirmed', async () => {
    mockConfirmRemove.mockResolvedValue(true)

    const { emitted } = renderComponent()

    await fireEvent.click(screen.getByRole('button', { name: 'Удалить состояние' }))

    await waitFor(() => {
      expect(emitted()).toHaveProperty('refreshWorkflow')
    })
  })

  it('does not emit refreshWorkflow when rejected', async () => {
    mockConfirmRemove.mockResolvedValue(false)

    const { emitted } = renderComponent()

    await fireEvent.click(screen.getByRole('button', { name: 'Удалить состояние' }))

    await waitFor(() => {
      expect(emitted()).not.toHaveProperty('refreshWorkflow')
    })
  })

  it('does not call confirm or API when workflowName is empty', async () => {
    const { emitted } = renderComponent({ workflowName: '' })

    await fireEvent.click(screen.getByRole('button', { name: 'Удалить состояние' }))

    expect(mockConfirmRemove).not.toHaveBeenCalled()
    expect(emitted()).not.toHaveProperty('refreshWorkflow')
  })

  it('does not call confirm or API when stepIndex is null', async () => {
    const { emitted } = renderComponent({ stepIndex: null })

    await fireEvent.click(screen.getByRole('button', { name: 'Удалить состояние' }))

    expect(mockConfirmRemove).not.toHaveBeenCalled()
    expect(emitted()).not.toHaveProperty('refreshWorkflow')
  })

  it('renders slot content instead of default button', () => {
    render(WorkflowRemoveStepFeature, {
      props: { workflowName: 'wf1', stepIndex: 0 },
      slots: {
        default: '<button data-testid="custom-trigger">Custom</button>',
      },
      global: {
        components: {
          FontAwesomeIcon: { template: '<span data-testid="fa-icon" />' },
        },
        plugins: [PrimeVue],
      },
    })

    expect(screen.getByTestId('custom-trigger')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Удалить состояние' })).toBeNull()
  })
})
