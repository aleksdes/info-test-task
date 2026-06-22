/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    mockWorkflowApi: (fixture?: string) => Chainable<Subject>
    mockWorkflowError: () => Chainable<Subject>
  }
}
