import IndexPage from '../pages/index'
import Page from '../pages/page'
import ReportsPage from '../pages/reports'

context('View reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubExternalMovementsCount')
    cy.task('stubEstablishmentsCount')
  })

  it('Report counts display', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportsCard().click()
    const reportsPage = Page.verifyOnPage(ReportsPage)
    reportsPage.externalMovementsCard().should('contain.text', '1234')
    reportsPage.establishmentsCard().should('contain.text', '5678')
  })
})
