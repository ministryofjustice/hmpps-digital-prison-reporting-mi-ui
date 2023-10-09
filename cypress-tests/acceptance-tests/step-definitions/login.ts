import { When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'

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
