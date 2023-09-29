import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'
import IndexPage from '../../common/pages'

When(/I navigate to the (.+) page/, (page: string) => {
  const lowercasePage = page.toLowerCase()

  switch (lowercasePage) {
    case 'home':
      cy.visit('/')
      break
    default:
      cy.visit(`/${lowercasePage}`)
  }
})

Then(/I (arrive on|am redirected to) the (.+) page/, (navigationType: string, page: string) => {
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

Then(/the message "(.+)" is displayed/, (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})
