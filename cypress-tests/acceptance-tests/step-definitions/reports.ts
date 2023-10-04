/* eslint-disable func-names */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import ReportsPage from '../../common/pages/ReportsPage'
import { components } from '../../../server/types/api'
import VariantsPage from '../../common/pages/VariantsPage'

const getReportDefinitions = (context: Mocha.Context) => {
  if (!context.reportDefinitions) {
    return cy.getCookie('jwtSession', { domain: Cypress.env('SIGN_IN_URL') }).then(tokenCookie => {
      return cy
        .request({
          url: `${Cypress.env('API_BASE_URL')}/definitions?renderMethod=HTML`,
          auth: {
            bearer: tokenCookie.value,
          },
        })
        .then(response => {
          const reportDefinitions = response.body as Array<components['schemas']['ReportDefinition']>
          context.reportDefinitions = reportDefinitions
          return reportDefinitions
        })
    })
  }
  return cy.wrap(context.reportDefinitions as Array<components['schemas']['ReportDefinition']>)
}

Given('I navigate to a list report', function (this: Mocha.Context) {
  getReportDefinitions(this).then(reportDefinitions => {
    let reportId
    let variantId

    // eslint-disable-next-line no-unused-expressions
    expect(
      reportDefinitions.find(
        reportDefinition =>
          reportDefinition.variants.find(variantDefinition => {
            if (variantDefinition.specification.template === 'list') {
              reportId = reportDefinition.id
              variantId = variantDefinition.id
              this.currentReportDefinition = reportDefinition
              this.currentVariantDefinition = variantDefinition
              return true
            }
            return false
          }) !== null,
      ),
    ).is.not.null

    cy.visit(`/reports/${reportId}/${variantId}`)
  })
})

When('I click on a report card', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)
  getReportDefinitions(this).then(reportDefinitions => {
    const reportDefinition = reportDefinitions.pop()
    this.currentReportDefinition = reportDefinition
    page.card(reportDefinition.id).click()
  })
})

When('I click on a variant card', function (this: Mocha.Context) {
  const page = new VariantsPage(this.currentReportDefinition)

  page.checkOnPage()

  const variantDefinition = page.reportDefinition.variants.pop()
  this.currentVariantDefinition = variantDefinition

  page.card(variantDefinition.id).click()
})

Then('a card is displayed for each report', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)
  getReportDefinitions(this).then(reportDefinitions => {
    reportDefinitions.forEach(reportDefinition => {
      page
        .card(reportDefinition.id)
        .should('not.be.null')
        .should('contain.text', reportDefinition.name)
        .parent()
        .parent()
        .get('.card__description')
        .should('contain.text', reportDefinition.description)
    })
  })
})

Then('a card is displayed for each variant', function (this: Mocha.Context) {
  const page = new VariantsPage(this.currentReportDefinition)

  page.checkOnPage()

  page.reportDefinition.variants.forEach(variantDefinition => {
    page
      .card(variantDefinition.id)
      .should('not.be.null')
      .should('contain.text', variantDefinition.name)
      .parent()
      .parent()
      .get('.card__description')
      .should('contain.text', variantDefinition.description)
  })
})
