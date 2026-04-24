/**
 * Header tests for the PROBATION deployment.
 *
 * Prerequisites:
 *   - App started with: npm run start-feature:probation:test  (uses feature-probation.env — probation config)
 *   - Wiremock running on port 9091:  docker compose -f docker-compose-test.yml up -d
 *
 * Run individually: npm run int-test:probation-header
 */

import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

context('Probation deployment — PDS header', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubDefinitions')
    cy.task('stubDefinition')
    cy.task('stubUserCaseload')
    cy.task('stubProductCollections')
    cy.task('stubProbationComponents')
  })

  it('shows the PDS header injected from the probation component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"]').should('exist')
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

    cy.get('[data-qa="pds-header"] [data-qa="header-user-name"]').should('exist')
  })

  it('shows the sign-out link in the PDS header', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-header"] [data-qa="signOut"]')
      .should('exist')
      .and('have.attr', 'href', '/sign-out')
  })

  it('shows the PDS footer injected from the probation component API', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.get('[data-qa="pds-footer"]').should('exist')
    cy.get('[data-qa="dps-footer"]').should('not.exist')
  })
})
