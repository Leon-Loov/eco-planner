const pages: Array<string> = [
  'dashboard',
  'info',
  'metaRoadmap/createMetaRoadmap',
  'metaRoadmap/a6b67e8d-5e00-4fe2-8510-17b65166b424',
  'metaRoadmap/a6b67e8d-5e00-4fe2-8510-17b65166b424/editMetaRoadmap',
  'roadmap/createRoadmap',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/editRoadmap',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/createGoal',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/273b5cdb-611f-42d0-b783-b31769e82674',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/273b5cdb-611f-42d0-b783-b31769e82674/editGoal',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/273b5cdb-611f-42d0-b783-b31769e82674/action/createAction',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/273b5cdb-611f-42d0-b783-b31769e82674/action/e3188abc-6697-49ad-9416-67f925fdad09',
  'roadmap/4781991d-1597-4a03-bb09-22210c1bbbab/goal/273b5cdb-611f-42d0-b783-b31769e82674/action/e3188abc-6697-49ad-9416-67f925fdad09/editAction',
  'user/admin'
]

describe('Screenshot tests', () => {

  before(() => {
    // First visit signup
    cy.visit('/signup').screenshot('screenshot', {capture: "fullPage"})

    // Then visit Login
    cy.visit('/login').screenshot('screenshot', {capture: "fullPage"})
    cy.get('input[type="text"]').type('admin') // TODO: Probably do this in some nicer way :)
    cy.get('input[type="password"]').type('password123')
    cy.get('button[role="submit"]').click() // TODO: Should probably check that login api returns status 200 
  })

  it('screenshots page', () => {
    pages.forEach(page => {
      cy.visit(`/${page}`).screenshot('screenshot', {capture: "fullPage"})
    })
  })
})