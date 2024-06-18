import { Then } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import IndexPage from '../../common/pages'

Then('the Reports list is displayed', () => {
  const page = Page.verifyOnPage(IndexPage)
  page.reportTable().contains('Test Report')
})
