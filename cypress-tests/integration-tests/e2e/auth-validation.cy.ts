import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

const authErrorMessage = 'Sorry, there is a problem with authenticating your request.'

context('Auth source validation', () => {
  describe('Prisons app (requires NOMIS)', () => {
    beforeEach(() => {
      Cypress.config('baseUrl', Cypress.env('prisonBaseUrl') as string)
      cy.task('reset')
      cy.task('stubDefinitions')
      cy.task('stubDefinition')
      cy.task('stubUserCaseload')
      cy.task('stubProductCollections')
    })

    afterEach(() => {
      Cypress.config('baseUrl', Cypress.env('prisonBaseUrl') as string)
    })

    it('allows a NOMIS user', () => {
      cy.task('stubSignIn', 'nomis')
      cy.task('stubAuthUser', { authSource: 'nomis' })
      cy.signIn()
      Page.verifyOnPage(IndexPage)
    })

    it('blocks a DELIUS user', () => {
      cy.task('stubSignIn', 'delius')
      cy.task('stubAuthUser', { authSource: 'delius' })
      cy.signIn({ failOnStatusCode: false })
      cy.contains(authErrorMessage)
    })
  })

  describe('Probation app (requires DELIUS)', () => {
    beforeEach(() => {
      Cypress.config('baseUrl', Cypress.env('probationBaseUrl') as string)
      cy.task('reset')
      cy.task('stubDefinitions')
      cy.task('stubDefinition')
      cy.task('stubProductCollections')
      cy.task('stubProbationComponents')
    })

    afterEach(() => {
      Cypress.config('baseUrl', Cypress.env('prisonBaseUrl') as string)
    })

    it('allows a DELIUS user', () => {
      cy.task('stubSignIn', 'delius')
      cy.task('stubAuthUser', { authSource: 'delius' })
      cy.signIn()
      Page.verifyOnPage(IndexPage)
    })

    it('blocks a NOMIS user', () => {
      cy.task('stubSignIn', 'nomis')
      cy.task('stubAuthUser', { authSource: 'nomis' })
      cy.signIn({ failOnStatusCode: false })
      cy.contains(authErrorMessage)
    })
  })
})
