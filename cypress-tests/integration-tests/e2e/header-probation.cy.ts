/**
 * Header tests for the PROBATION deployment.
 *
 * Prerequisites:
 *   - App started with: npm run start-feature:probation  (uses feature-probation.env — app on PORT, metrics on PORT+1)
 *   - Wiremock running on port 9091:  docker compose -f docker-compose-test.yml up -d
 *
 * Covered by the full integration suite: npm run int-test (or int-test:ui)
 */

import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

context('Probation deployment — PDS header', () => {
  beforeEach(() => {
    Cypress.config('baseUrl', Cypress.env('probationBaseUrl') as string)
    cy.task('reset')
    cy.task('stubSignIn', 'delius')
    cy.task('stubAuthUser', { authSource: 'delius' })
    cy.task('stubDefinitions')
    cy.task('stubDefinition')
    cy.task('stubUserCaseload')
    cy.task('stubProductCollections')
    cy.task('stubProbationComponents')
  })

  afterEach(() => {
    Cypress.config('baseUrl', Cypress.env('prisonBaseUrl') as string)
  })

  it('shows the PDS header injected from the probation component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"]').should('exist')
    cy.get('[data-qa="pds-header"]').should('contain', 'Probation Digital Services')
    cy.get('[data-qa="pds-header"] .probation-common-header').should('exist')
  })

  it('does not show the DPS prison header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="dps-header"]').should('not.exist')
  })

  it('does not fall back to the static HMPPS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="hmpps-static-header"]').should('not.exist')
  })

  it('shows the user name link in the PDS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"] [data-qa="probation-common-header-user-name"]').should('exist')
  })

  it('shows the sign-out link in the PDS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"] a[href="/sign-out"]').should('exist').and('contain', 'Sign out')
  })

  it('shows the PDS footer injected from the probation component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-footer"]').should('exist')
    cy.get('[data-qa="dps-footer"]').should('not.exist')
  })
})
