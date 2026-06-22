interface WorkflowStep {
  initialIndex: number
  name: string
  color?: string
  x: number
  y: number
  nextSteps: number[]
}

interface Workflow {
  name: string
  steps: WorkflowStep[]
}

let currentWorkflow: Workflow | null = null

Cypress.Commands.add('mockWorkflowApi', (fixture?: string) => {
  const f = fixture || 'workflow'

  cy.fixture(f).then((workflow: Workflow) => {
    currentWorkflow = workflow

    cy.intercept('GET', '/workflow/get*', () => {
      return { statusCode: 200, body: currentWorkflow }
    }).as('getWorkflow')

    cy.intercept('POST', '/workflow/createStep', (req) => {
      currentWorkflow = {
        ...currentWorkflow!,
        steps: [
          ...currentWorkflow!.steps,
          {
            initialIndex: currentWorkflow!.steps.length,
            name: req.body.stepName,
            color: req.body.color || 'ffffff',
            x: req.body.x || 0,
            y: req.body.y || 0,
            nextSteps: [],
          },
        ],
      }
      req.reply({ statusCode: 200, body: currentWorkflow.steps[currentWorkflow.steps.length - 1] })
    }).as('createStep')

    cy.intercept('POST', '/workflow/deleteStep', (req) => {
      currentWorkflow = {
        ...currentWorkflow!,
        steps: currentWorkflow!.steps.filter(
          s => s.initialIndex !== req.body.stepInitialIndex,
        ),
      }
      req.reply({ statusCode: 200, body: currentWorkflow })
    }).as('deleteStep')

    cy.intercept('POST', '/workflow/changeStepName', (req) => {
      currentWorkflow = {
        ...currentWorkflow!,
        steps: currentWorkflow!.steps.map(s =>
          s.initialIndex === req.body.stepInitialIndex
            ? { ...s, name: req.body.stepName }
            : s,
        ),
      }
      req.reply({ statusCode: 200, body: currentWorkflow })
    }).as('changeStepName')

    cy.intercept('POST', '/workflow/changeStepXY', (req) => {
      currentWorkflow = {
        ...currentWorkflow!,
        steps: currentWorkflow!.steps.map(s =>
          s.initialIndex === req.body.stepInitialIndex
            ? { ...s, x: req.body.x, y: req.body.y }
            : s,
        ),
      }
      req.reply({ statusCode: 200, body: currentWorkflow })
    }).as('changeStepXY')
  })
})

Cypress.Commands.add('mockWorkflowError', () => {
  cy.intercept('GET', '/workflow/get*', {
    statusCode: 500,
    body: { error: 'Server error' },
  }).as('getWorkflowError')
})

