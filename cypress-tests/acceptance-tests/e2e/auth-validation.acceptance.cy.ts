import AuthSignInPage from '../../common/pages/authSignIn'
import Page from '../../common/pages/page'

const authErrorMessage = 'Sorry, there is a problem with authenticating your request.'

const signIn = (username: string, password: string) => {
  const page = Page.verifyOnPage(AuthSignInPage)
  page.usernameInput().type(username)
  page.passwordInput().type(password)
  page.signInButton().click()
}

context('Auth source validation (acceptance)', () => {
  it('NOMIS user cannot access the Probation UI', () => {
    cy.visit(Cypress.env('PROBATION_BASE_URL'))
    signIn(Cypress.env('USERNAME'), Cypress.env('PASSWORD'))
    cy.contains(authErrorMessage)
  })

  it('DELIUS user cannot access the Prisons UI', () => {
    cy.visit('/')
    signIn(Cypress.env('PROBATION_USERNAME'), Cypress.env('PROBATION_PASSWORD'))
    cy.contains(authErrorMessage)
  })
})
