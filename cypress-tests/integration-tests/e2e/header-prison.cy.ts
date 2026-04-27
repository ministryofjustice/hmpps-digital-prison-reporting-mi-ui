/**
 * Header tests for the PRISON deployment.
 *
 * Prerequisites:
 *   - App started with: npm run start-feature:dev  (uses feature.env — prison config)
 *   - Wiremock running on port 9091:  docker compose -f docker-compose-test.yml up -d
 *
 * Covered by the full integration suite: npm run int-test (or int-test:ui)
 */

import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

context('Prison deployment — DPS header', () => {
  beforeEach(() => {
    Cypress.config('baseUrl', Cypress.env('prisonBaseUrl') as string)
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubDefinitions')
    cy.task('stubDefinition')
    cy.task('stubUserCaseload')
    cy.task('stubProductCollections')
    cy.task('stubPrisonComponents')
  })

  it('shows the DPS header injected from the prison component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="dps-header"]').should('exist')
    cy.get('[data-qa="dps-header"]').should('have.class', 'hmpps-header')
    cy.get('[data-qa="dps-header"]').invoke('text').should('not.include', 'Probation Digital Services')
  })

  it('does not show the PDS probation header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"]').should('not.exist')
  })

  it('does not fall back to the static HMPPS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="hmpps-static-header"]').should('not.exist')
  })

  it('shows the user name link in the DPS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="dps-header"] [data-qa="header-user-name"]').should('exist')
  })

  it('shows the sign-out link in the DPS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="dps-header"] [data-qa="signOut"]')
      .should('exist')
      .and('have.attr', 'href', '/sign-out')
  })

  it('shows the DPS footer injected from the prison component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="dps-footer"]').should('exist')
    cy.get('[data-qa="pds-footer"]').should('not.exist')
  })
})
