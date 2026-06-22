describe('App', () => {
  it('should load the page', () => {
    cy.visit('/')
    cy.get('#app').should('exist')
  })
})
