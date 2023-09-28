import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'
import IndexPage from '../../common/pages'

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

When('I log in with valid credentials', () => {
  const page = Page.verifyOnPage(AuthSignInPage)
  page.usernameInput().type(Cypress.env('USERNAME'))
  page.passwordInput().type(Cypress.env('PASSWORD'))
  page.signInButton().click()
})

Then('I am redirected to the {string} page', (page: string) => {
  switch (page.toLowerCase()) {
    case 'home':
      Page.verifyOnPage(IndexPage)
      break

    case 'login':
      Page.verifyOnPage(AuthSignInPage)
      break

    default:
  }
})

Then('the message {string} is displayed', (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})
