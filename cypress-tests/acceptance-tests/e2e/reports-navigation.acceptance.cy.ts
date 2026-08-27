import IndexPage from '../../common/pages'
import AuthSignInPage from '../../common/pages/authSignIn'
import Page from '../../common/pages/page'

context('report navigation smoke tests', () => {
  it('should have a breadcrumb on the list page back to the home page', () => {
    cy.visit('/')
    const page = Page.verifyOnPage(AuthSignInPage)
    page.usernameInput().type(Cypress.env('USERNAME'))
    page.passwordInput().type(Cypress.env('PASSWORD'))
    page.signInButton().click()
    cy.visit('/')

    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.reportLinks().first().click()
    cy.get(`a.govuk-breadcrumbs__link`).contains('Digital Prison Reporting')
  })
})
