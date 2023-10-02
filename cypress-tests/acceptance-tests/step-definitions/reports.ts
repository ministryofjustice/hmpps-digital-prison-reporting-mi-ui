/* eslint-disable func-names */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import ReportsPage from '../../common/pages/ReportsPage'
import { components } from '../../../server/types/api'
import VariantsPage from '../../common/pages/VariantsPage'
import ListPage from '../../common/pages/ListPage'

const getReportDefinitions = (context: Mocha.Context) => {
  if (!context.reportDefinitions) {
    return cy.getCookie('jwtSession', { domain: 'sign-in-dev.hmpps.service.justice.gov.uk' }).then(tokenCookie => {
      return cy
        .request({
          url: 'https://digital-prison-reporting-mi-dev.hmpps.service.justice.gov.uk/definitions?renderMethod=HTML',
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

When('I click on a report card', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)
  getReportDefinitions(this).then(reportDefinitions => {
    const reportDefinition = reportDefinitions.pop()
    this.currentReportDefinition = reportDefinition
    page.card(reportDefinition.id).click()
  })
})

When('I click on a variant card', function (this: Mocha.Context) {
  const reportDefinition: components['schemas']['ReportDefinition'] = this.currentReportDefinition
  const page = new VariantsPage(reportDefinition.id, reportDefinition.name)

  page.checkOnPage()

  const variantDefinition = reportDefinition.variants.pop()
  this.currentVariantDefinition = variantDefinition

  page.card(variantDefinition.id).click()
})

When(/^I click the Show Filter button$/, function () {
  const page = new ListPage(this.currentVariantDefinition.name)
  page.showFilterButton().click()
})

Then('a card is displayed for each variant', function (this: Mocha.Context) {
  const reportDefinition: components['schemas']['ReportDefinition'] = this.currentReportDefinition
  const page = new VariantsPage(reportDefinition.id, reportDefinition.name)

  page.checkOnPage()

  reportDefinition.variants.forEach(variantDefinition => {
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

Then(/^the Show Filter button is displayed$/, function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition.name)

  page.showFilterButton().should('exist')
})

Then(/^the Filter panel is (open|closed)$/, function (panelStatus) {
  const panel = new ListPage(this.currentVariantDefinition.name).filterPanel()

  if (panelStatus === 'open') {
    panel.should('not.have.class', 'moj-js-hidden')
  } else {
    panel.should('have.class', 'moj-js-hidden')
  }
})
