describe('BlogPage', () => {
  it('auth', () => {
    cy.visit('/')
    cy.contains('Login').click()
    cy.get('[placeholder="Login"]').type('admin')
    cy.get('[placeholder="Login"]').should('have.value', 'admin')
    cy.get('[placeholder="Password"]').type('123')
    cy.get('[placeholder="Password"]').should('have.value', '123')
    cy.contains('Send').click()
    cy.contains('Log out')
  })
})