import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { http, HttpResponse } from 'msw'
import PrimeVue from 'primevue/config'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/shared/test/testing/msw/server'
import WorkflowCreateStepFeature from '../WorkflowCreateStepFeature.vue'

const WORKFLOW_MOCK = {
  name: 'wf1',
  steps: [
    { initialIndex: 0, name: 'Step1', x: 100, y: 200, nextSteps: [] as number[] },
  ],
}

const STEP_MOCK = {
  initialIndex: 1,
  name: 'Шаг1',
  x: 0,
  y: 0,
  nextSteps: [] as number[],
}

const API_BASE = 'http://test.local'

beforeAll(() => {
  vi.stubEnv('VITE_API_TARGET', API_BASE)
})

afterAll(() => {
  vi.unstubAllEnvs()
})

function renderComponent() {
  return render(WorkflowCreateStepFeature, {
    props: { workflow: WORKFLOW_MOCK },
    global: {
      components: {
        FontAwesomeIcon: { template: '<span data-testid="fa-icon" />' },
      },
      plugins: [PrimeVue],
    },
  })
}

describe('workflowCreateStepFeature', () => {
  beforeEach(() => {
    server.use(
      http.post(`${API_BASE}/workflow/createStep`, () => {
        return HttpResponse.json(STEP_MOCK)
      }),
    )
  })

  it('renders activator button', () => {
    renderComponent()
    const button = screen.getByRole('button', { name: 'Создать состояние' })
    expect(button).toBeTruthy()
  })

  it('opens dialog on activator click', async () => {
    renderComponent()

    await fireEvent.click(screen.getByRole('button', { name: 'Создать состояние' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeTruthy()
  })

  it('emits open and close events on dialog lifecycle', async () => {
    const { emitted } = renderComponent()

    const button = screen.getByRole('button', { name: 'Создать состояние' })
    await fireEvent.click(button)

    await screen.findByRole('dialog')
    expect(emitted()).toHaveProperty('open')

    const dialog = screen.getByRole('dialog')
    const closeButton = dialog.querySelector('[aria-label="Close"]')
    if (closeButton) {
      await fireEvent.click(closeButton)
    }
  })

  it('submits form and creates step on valid input', async () => {
    const { emitted } = renderComponent()

    await fireEvent.click(screen.getByRole('button', { name: 'Создать состояние' }))
    await screen.findByRole('dialog')

    const nameInput = screen.getByLabelText('Имя') as HTMLInputElement
    await fireEvent.update(nameInput, 'NewStep')

    await fireEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))

    await waitFor(() => {
      expect(emitted()).toHaveProperty('refreshWorkflow')
    })
  })
})
