import IndexPage from '../../common/pages'
import AuthSignInPage from '../../common/pages/authSignIn'
import Page from '../../common/pages/page'
import RequestPage from '../../common/pages/requestPage'

context('home/catalogue page smoke tests', () => {
  it('should show the reports list', () => {
    cy.visit('/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest')
    const page = Page.verifyOnPage(AuthSignInPage)
    page.usernameInput().type(Cypress.env('USERNAME'))
    page.passwordInput().type(Cypress.env('PASSWORD'))
    page.signInButton().click()
    cy.visit('/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest')
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportTable().contains('Test Report')
  })

  it('should take me to the reports page when clicking the reports card', () => {
    cy.visit('/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest')
    const page = Page.verifyOnPage(AuthSignInPage)
    page.usernameInput().type(Cypress.env('USERNAME'))
    page.passwordInput().type(Cypress.env('PASSWORD'))
    page.signInButton().click()
    cy.visit('/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest')
    const verifyPage = Page.verifyOnPage(IndexPage)
    verifyPage.reportLinks().first().click()
    new RequestPage().checkOnPage()
  })
})
