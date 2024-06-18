import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

Given('I navigate to a list report', () => {
  cy.visit(`/reports/test-report/test-variant?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
})

Then('a link is displayed for each report', () => {
  const page = Page.verifyOnPage(IndexPage)

  page.reportTable().should('not.be.null').should('contain.text', 'Test Report')
})

Then('a link is displayed for each variant', () => {
  const page = new IndexPage()

  page
    .reportTable()
    .should('contain.text', 'Test Variant')
    .should('contain.text', 'Test Variant (unprintable and sensitive)')
})
When(/^I click on a report link$/, () => {
  const page = Page.verifyOnPage(IndexPage)

  page.reportLinks().first().click()
})
