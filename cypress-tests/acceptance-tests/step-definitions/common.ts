import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'
import IndexPage from '../../common/pages'
import ListPage from '../pages/ListPage'
import RequestPage from '../../common/pages/requestPage'

When(/I navigate to the (.+) page/, (page: string) => {
  const lowercasePage = page.toLowerCase()

  switch (lowercasePage) {
    case 'home':
      cy.visit('/?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest')
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

    case 'request':
      new RequestPage().checkOnPage()
      break

    default:
  }
})

Then(/the message "(.+)" is displayed/, (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})

Then(/^a breadcrumb link is shown for the (.+) page$/, (page: string) => {
  switch (page.toLowerCase()) {
    case 'home':
      cy.get(`a.govuk-breadcrumbs__link:not([href~="/"])`).contains('Home')
      break

    case 'request':
      cy.get(`a.govuk-breadcrumbs__link[href~="/request"]`).contains('Request Report')
      break

    default:
      cy.get(`a.govuk-breadcrumbs__link[href~="/${page.toLowerCase()}"]`).contains(page)
  }
})
