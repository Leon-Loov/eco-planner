describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:3000/').screenshot('screenshot', {capture: "fullPage"})
  })
})