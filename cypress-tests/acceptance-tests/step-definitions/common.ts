import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'
import IndexPage from '../../common/pages'
import ListPage from '../pages/ListPage'

When(/I navigate to the (.+) page/, (page: string) => {
  const lowercasePage = page.toLowerCase()

  switch (lowercasePage) {
    case 'home':
      cy.visit('/')
      break
    default:
      cy.visit(`/${lowercasePage}?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
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

    case 'list':
      new ListPage().checkOnPage()
      break

    default:
  }
})

Then(/the message "(.+)" is displayed/, (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})

Then(/^a breadcrumb link is shown for the (.+) page$/, (page: string) => {
  let href = `/${page.toLowerCase()}`
  let title = page

  switch (page) {
    case 'Home':
      href = '/'
      break

    case 'Variants':
      href = `/reports/test-report`
      title = 'Test Report'
      break

    default:
  }

  cy.get(`a.govuk-breadcrumbs__link[href^='${href}'`).contains(title)
})
