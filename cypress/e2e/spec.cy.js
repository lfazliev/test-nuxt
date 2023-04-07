describe('Clicks the login', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://blog.lfazliev.com')
    cy.contains('Login').click()
    cy.get('[placeholder="Login"]').type('fake@email.com')
    cy.get('[placeholder="Login"]').should('have.value', 'fake@email.com')
  })
})