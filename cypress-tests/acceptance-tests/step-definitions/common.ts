/* eslint-disable func-names */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import AuthSignInPage from '../../common/pages/authSignIn'
import IndexPage from '../../common/pages'
import ListPage from '../../common/pages/ListPage'

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

Then(
  /I (arrive on|am redirected to) the (.+) page/,
  function (this: Mocha.Context, navigationType: string, page: string) {
    switch (page.toLowerCase()) {
      case 'home':
        Page.verifyOnPage(IndexPage)
        break

      case 'login':
        Page.verifyOnPage(AuthSignInPage)
        break

      case 'list':
        new ListPage(this.currentVariantDefinition.name).checkOnPage()
        break

      default:
    }
  },
)

Then(/the message "(.+)" is displayed/, (message: string) => {
  Page.verifyOnPage(AuthSignInPage)
  cy.contains(message)
})

Then(/^a breadcrumb link is shown for the (.+) page$/, function (this: Mocha.Context, page: string) {
  let href = `/${page.toLowerCase()}`
  let title = page

  switch (page) {
    case 'Home':
      href = '/'
      break

    case 'Variants':
      href = `/reports/${this.currentReportDefinition.id}`
      title = this.currentReportDefinition.name
      break

    default:
  }

  cy.get(`a.govuk-breadcrumbs__link[href='${href}'`).contains(title)
})

Then(/^a breadcrumb with no link is shown for the (.+) page$/, function (page: string) {
  let title = page

  switch (page) {
    case 'Variants':
      title = this.currentReportDefinition.name
      break

    case 'List':
      title = this.currentVariantDefinition.name
      break

    default:
  }

  cy.get(`.govuk-breadcrumbs__list-item[aria-current=page]`).contains(title)
})
