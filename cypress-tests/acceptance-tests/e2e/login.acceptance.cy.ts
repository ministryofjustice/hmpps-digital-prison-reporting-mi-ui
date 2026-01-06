import AuthSignInPage from '../../common/pages/authSignIn'
import Page from '../../common/pages/page'

context('login smoke tests', () => {
  it('Should cause an error message to be displayed signing in with invalid credentials', () => {
    cy.visit(`/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
    const page = Page.verifyOnPage(AuthSignInPage)
    page.usernameInput().type('Invalid user')
    page.passwordInput().type('Invalid password')
    page.signInButton().click()
    Page.verifyOnPage(AuthSignInPage)
    cy.contains('Enter a valid username and password')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit(`/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })
})
