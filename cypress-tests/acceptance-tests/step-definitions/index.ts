import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

When('I click on the Reports card', () => {
  const page = Page.verifyOnPage(IndexPage)
  page.reportsCard().click()
})

Then('the Reports card is displayed', () => {
  const page = Page.verifyOnPage(IndexPage)
  page.reportsCard().contains('Reports')
})
