import IndexPage from '../pages/index'
import Page from '../pages/page'
import ReportsPage from '../pages/reports'

context('View reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubExternalMovements')
    cy.task('stubExternalMovementsCount')
    cy.task('stubEstablishmentsCount')
  })

  it('Report page displays', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportsCard().click()
    Page.verifyOnPage(ReportsPage)
  })

  // TODO: Add test coverage for external movements page.
})
