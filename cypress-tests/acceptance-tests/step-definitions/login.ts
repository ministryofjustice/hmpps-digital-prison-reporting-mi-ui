import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'

When('I navigate to the {string} page', (page: string) => {
  const lowercasePage = page.toLowerCase()

  switch (lowercasePage) {
    case 'home':
      cy.visit('/')
      break
    default:
      cy.visit(`/${lowercasePage}`)
  }
})

When('I attempt to log in with invalid credentials', () => {
  const page = Page.verifyOnPage(AuthSignInPage)
  page.usernameInput().type('Invalid user')
  page.passwordInput().type('Invalid password')
  page.signInButton().click()
})

Then('I am redirected to the login page', () => {
  cy.visit('/')
  Page.verifyOnPage(AuthSignInPage)
})

Then('the message {string} is displayed', (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})
