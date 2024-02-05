/* eslint-disable func-names, no-unused-expressions */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import Page from '../../common/pages/page'
import ReportsPage from '../../common/pages/ReportsPage'
import VariantsPage from '../../common/pages/VariantsPage'

const getReportDefinitions = (context: Mocha.Context) => {
  if (!context.reportDefinitions) {
    return cy.getCookie('jwtSession', { domain: Cypress.env('SIGN_IN_URL') }).then(tokenCookie => {
      return cy
        .request({
          url: `${Cypress.env(
            'API_BASE_URL',
          )}/definitions?renderMethod=HTML&dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`,
          auth: {
            bearer: tokenCookie.value,
          },
        })
        .then(response => {
          const reportDefinitions = response.body as Array<components['schemas']['ReportDefinitionSummary']>
          context.reportDefinitions = reportDefinitions
          return reportDefinitions
        })
    })
  }
  return cy.wrap(context.reportDefinitions as Array<components['schemas']['ReportDefinitionSummary']>)
}

const getFullDefinition = (context: Mocha.Context, reportId: string, variantId: string) => {
  if (!context.fullDefinition) {
    return cy.getCookie('jwtSession', { domain: Cypress.env('SIGN_IN_URL') }).then(tokenCookie => {
      return cy
        .request({
          url: `${Cypress.env(
            'API_BASE_URL',
          )}/definitions/${reportId}/${variantId}?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`,
          auth: {
            bearer: tokenCookie.value,
          },
        })
        .then(response => {
          const fullDefinition = response.body as components['schemas']['SingleVariantReportDefinition']
          context.fullDefinition = fullDefinition
          return fullDefinition
        })
    })
  }
  return cy.wrap(context.fullDefinition as components['schemas']['SingleVariantReportDefinition'])
}

Given('I navigate to a list report', function (this: Mocha.Context) {
  getReportDefinitions(this).then(reportDefinitions => {
    const testDefinitionSummary = reportDefinitions[0]

    expect(testDefinitionSummary).is.not.null

    const variantId = testDefinitionSummary.variants[0].id

    getFullDefinition(this, testDefinitionSummary.id, variantId).then(fullDefinition => {
      expect(fullDefinition.variant.specification.template).is.equal('list')

      cy.visit(`/reports/${fullDefinition.id}/${variantId}?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
    })
  })
})

When('I click on a report card', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)
  getReportDefinitions(this).then(reportDefinitions => {
    this.currentReportDefinition = reportDefinitions.pop()
    page.card().click()
  })
})

When('I click on a variant card', function (this: Mocha.Context) {
  const page = new VariantsPage(this.currentReportDefinition)
  const variantDefinition = page.reportDefinition.variants.pop()
  this.currentVariantDefinition = variantDefinition
  getFullDefinition(this, page.reportDefinition.id, variantDefinition.id).then(() => {
    page.card(variantDefinition.id).click()
  })
})

Then('a card is displayed for each report', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)

  getReportDefinitions(this).then(reportDefinitions => {
    reportDefinitions.forEach(reportDefinition => {
      page
        .card()
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
