describe('Minimalist Clock E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the clock page', () => {
    cy.contains('Minimalist Clock').should('be.visible')
  })
})
