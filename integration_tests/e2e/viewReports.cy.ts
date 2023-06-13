import IndexPage from '../pages/index'
import Page from '../pages/page'
import ReportsPage from '../pages/reports'

context('View reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubExternalMovementsCount')
  })

  it('External movement count displays', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportsCard().click()
    const reportsPage = Page.verifyOnPage(ReportsPage)
    reportsPage.externalMovementsCard().should('contain.text', '1234')
  })
})
