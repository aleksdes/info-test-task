import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkflow } from '@/entities/workflow'
import WorkflowTable from '../WorkflowTable.vue'

const WORKFLOW_MOCK = {
  name: 'wf1',
  steps: [
    { initialIndex: 0, name: 'Step1', x: 100, y: 200, nextSteps: [1] },
    { initialIndex: 1, name: 'Step2', x: 300, y: 200, nextSteps: [] as number[] },
  ],
}

let pinia: ReturnType<typeof createPinia>
let refetchWorkflow: ReturnType<typeof vi.fn>

beforeAll(() => {
  vi.stubEnv('VITE_API_TARGET', 'http://test.local')
})

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)

  const store = useWorkflow()
  store.workflowData = WORKFLOW_MOCK
  store.selectedStep = null

  refetchWorkflow = vi.fn()
})

function renderComponent() {
  return render(WorkflowTable, {
    global: {
      plugins: [PrimeVue, pinia],
      stubs: {
        FontAwesomeIcon: { template: '<span data-testid="fa-icon" />' },
        WorkflowCreateStepFeature: { template: '<div data-testid="create-step" />' },
        WorkflowRemoveStepFeature: { template: '<div data-testid="remove-step" />' },
        WorkflowUpdateNameStepFeature: { template: '<div data-testid="update-name-step" />' },
        WorkflowStepItem: { template: '<span class="step-item">{{ stepData?.name }}</span>' },
      },
      provide: {
        refetchWorkflow,
      },
    },
  })
}

describe('workflowTable', () => {
  it('renders header with workflow structure title', () => {
    renderComponent()
    expect(screen.getByText('Структура рабочего процесса')).toBeTruthy()
  })

  it('renders create step feature component', () => {
    renderComponent()
    expect(screen.getByTestId('create-step')).toBeTruthy()
  })

  it('renders steps in the table', async () => {
    renderComponent()
    await vi.waitFor(() => {
      expect(screen.getAllByText('Step1').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Step2').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders coordinate columns', async () => {
    renderComponent()
    await vi.waitFor(() => {
      const cells = screen.getAllByText('100')
      expect(cells.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders edit button for each step', async () => {
    renderComponent()
    await vi.waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: 'Редактировать состояние' })
      expect(editButtons.length).toBe(2)
    })
  })

  it('renders remove step feature for each step', () => {
    renderComponent()
    const removeFeatures = screen.getAllByTestId('remove-step')
    expect(removeFeatures.length).toBe(2)
  })
})
