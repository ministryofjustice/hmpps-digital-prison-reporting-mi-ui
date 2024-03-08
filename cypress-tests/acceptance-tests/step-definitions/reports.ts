import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import ReportsPage from '../../common/pages/ReportsPage'
import VariantsPage from '../pages/VariantsPage'

Given('I navigate to a list report', () => {
  cy.visit(`/reports/test-report/test-variant?dataProductDefinitionsPath=definitions%2Fprisons%2Ftest`)
})

When('I click on a report card', () => {
  const page = Page.verifyOnPage(ReportsPage)
  page.card().click()
})

When('I click on a variant card', () => {
  const page = new VariantsPage()
  page.card().click()
})

Then('a card is displayed for each report', () => {
  const page = Page.verifyOnPage(ReportsPage)

  page
    .card()
    .should('not.be.null')
    .should('contain.text', 'Test Report')
    .parent()
    .parent()
    .get('.card__description')
    .should('contain.text', 'A report that exercises all of the front-end functionality')
})

Then('a card is displayed for each variant', () => {
  const page = new VariantsPage()

  page
    .cardGroup()
    .should('contain.text', 'Test Variant')
    .should('contain.text', 'A report that exercises all of the front-end functionality')
    .should('contain.text', 'Test Variant (unprintable and sensitive)')
    .should('contain.text', 'A report that exercises all of the front-end functionality, except print.')
})
