import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { http, HttpResponse } from 'msw'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/shared/test/testing/msw/server'
import WorkflowUpdateNameStepFeature from '../WorkflowUpdateNameStepFeature.vue'

vi.mock('@/entities/workflow', () => ({
  useWorkflow: () => ({ patch: () => {} }),
}))

const API_BASE = 'http://test.local'
const STEP_MOCK = {
  initialIndex: 0,
  name: 'Step1',
  x: 100,
  y: 200,
  nextSteps: [] as number[],
}
const WORKFLOW_MOCK = {
  name: 'wf1',
  steps: [STEP_MOCK],
}

beforeAll(() => {
  vi.stubEnv('VITE_API_TARGET', API_BASE)
})

afterAll(() => {
  vi.unstubAllEnvs()
})

function renderComponent(props?: Record<string, unknown>) {
  return render(WorkflowUpdateNameStepFeature, {
    props: {
      step: STEP_MOCK,
      workflowName: 'wf1',
      ...props,
    },
    global: {
      components: {
        FontAwesomeIcon: { template: '<span data-testid="fa-icon" />' },
      },
      directives: {
        tooltip: Tooltip,
      },
      plugins: [PrimeVue],
    },
  })
}

describe('workflowUpdateNameStepFeature', () => {
  beforeEach(() => {
    server.use(
      http.post(`${API_BASE}/workflow/changeStepName`, () => {
        return HttpResponse.json(WORKFLOW_MOCK)
      }),
    )
  })

  it('renders input pre-filled with step name and both buttons', async () => {
    renderComponent()

    const input = await screen.findByDisplayValue('Step1') as HTMLInputElement
    expect(input).toBeTruthy()

    expect(screen.getByRole('button', { name: 'Сохранить состояние' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeTruthy()
  })

  it('emits resetUpdate on cancel button click', async () => {
    const { emitted } = renderComponent()

    await fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))

    expect(emitted()).toHaveProperty('resetUpdate')
  })

  it('submits valid form, calls API, and emits resetUpdate', async () => {
    const { emitted } = renderComponent()

    const input = await screen.findByDisplayValue('Step1') as HTMLInputElement
    await fireEvent.update(input, 'UpdatedName')

    await fireEvent.click(screen.getByRole('button', { name: 'Сохранить состояние' }))

    await waitFor(() => {
      expect(emitted()).toHaveProperty('resetUpdate')
    })
  })

  it('does not submit with empty name (form validation prevents)', async () => {
    const { emitted } = renderComponent()

    const input = await screen.findByDisplayValue('Step1') as HTMLInputElement
    await fireEvent.update(input, '')

    await fireEvent.click(screen.getByRole('button', { name: 'Сохранить состояние' }))

    await waitFor(() => {
      expect(emitted()).not.toHaveProperty('resetUpdate')
    })
  })
})
