describe('Workflow CRUD', () => {
  describe('error state', () => {
    it('should show error popup on API failure', () => {
      cy.mockWorkflowError()
      cy.visit('/')
      cy.wait('@getWorkflowError')
      cy.contains('Ошибка').should('be.visible')
    })
  })

  describe('step creation', () => {
    beforeEach(() => {
      cy.mockWorkflowApi()
      cy.visit('/')
      cy.wait('@getWorkflow')
    })

    it('should open create step dialog and submit', () => {
      cy.contains('button', 'Создать состояние').click()
      cy.contains('Создание нового состояния').should('be.visible')
      cy.get('#name').should('be.visible')

      cy.get('#name').clear().type('Новый шаг')
      cy.contains('button', 'Подтвердить').click()

      cy.wait('@createStep')
      cy.contains('Создание нового состояния').should('not.exist')
    })

    it('should cancel create dialog', () => {
      cy.contains('button', 'Создать состояние').click()
      cy.contains('Создание нового состояния').should('be.visible')

      cy.get('.p-dialog-header').within(() => {
        cy.get('button').click()
      })
      cy.contains('Создание нового состояния').should('not.exist')
    })
  })

  describe('step deletion', () => {
    beforeEach(() => {
      cy.mockWorkflowApi()
      cy.visit('/')
      cy.wait('@getWorkflow')
    })

    it('should open confirm dialog on delete', () => {
      cy.get('button[aria-label="Удалить состояние"]').first().click()
      cy.contains('Подтверждение удаления').should('be.visible')
    })

    it('should cancel deletion on reject', () => {
      cy.get('button[aria-label="Удалить состояние"]').first().click()
      cy.contains('Подтверждение удаления').should('be.visible')
      cy.contains('button', 'Отмена').click()
      cy.contains('Закупка').should('be.visible')
    })

    it('should delete step and confirm removal', () => {
      cy.get('button[aria-label="Удалить состояние"]').first().click()
      cy.contains('Подтверждение удаления').should('be.visible')
      cy.contains('button', 'Удалить').click()
      cy.wait('@deleteStep')
    })
  })

  describe('step rename', () => {
    beforeEach(() => {
      cy.mockWorkflowApi()
      cy.visit('/')
      cy.wait('@getWorkflow')
    })

    it('should open inline edit form', () => {
      cy.get('button[aria-label="Редактировать состояние"]').first().click()
      cy.get('input').should('be.visible')
    })

    it('should cancel inline edit on cancel button', () => {
      cy.get('button[aria-label="Редактировать состояние"]').first().click()
      cy.get('input').should('be.visible')
      cy.get('button[aria-label="Отмена"]').click()
      cy.contains('Закупка').should('be.visible')
    })
  })
})
