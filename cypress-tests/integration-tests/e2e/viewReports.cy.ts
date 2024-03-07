import IndexPage from '../../common/pages'
import Page from '../../common/pages/page'
import ReportsPage from '../../common/pages/ReportsPage'
import ErrorPage from '../../common/pages/ErrorPage'

context('View reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubDefinitions')
    cy.task('stubDefinition')
    cy.task('stubUserCaseload')
  })

  it('Report page displays', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportsCard().click()
    Page.verifyOnPage(ReportsPage)
  })

  it('Report page rejects invalid reportId', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.visit('/reports/invalid-report', {
      failOnStatusCode: false,
    })

    const errorPage = new ErrorPage()
    errorPage.messageHeader().should('contain.text', 'Unrecognised report ID "invalid-report"')
    errorPage.statusCodeHeader().should('contain.text', '404')
  })

  it('Report page rejects invalid reportId', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.visit('/reports/invalid-report/last-year', {
      failOnStatusCode: false,
    })

    const errorPage = new ErrorPage()
    errorPage.messageHeader().should('contain.text', 'Unrecognised report ID "invalid-report"')
    errorPage.statusCodeHeader().should('contain.text', '404')
  })

  it('Report page rejects invalid variantId', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.visit('/reports/external-movements/last-year', {
      failOnStatusCode: false,
    })

    const errorPage = new ErrorPage()
    errorPage.messageHeader().should('contain.text', 'Unrecognised variant ID "last-year"')
    errorPage.statusCodeHeader().should('contain.text', '404')
  })
})
