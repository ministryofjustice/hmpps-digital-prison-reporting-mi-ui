import IndexPage from '../../common/pages'
import Page from '../../common/pages/page'
import ReportsPage from '../pages/reports'

context('View reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubDefinitions')
  })

  it('Report page displays', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportsCard().click()
    Page.verifyOnPage(ReportsPage)
  })
})
