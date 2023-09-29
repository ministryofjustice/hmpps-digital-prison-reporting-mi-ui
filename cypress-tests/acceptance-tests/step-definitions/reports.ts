import { Then } from '@badeball/cypress-cucumber-preprocessor'
import Page from '../../common/pages/page'
import ReportsPage from '../../integration-tests/pages/reports'
import { components } from '../../../server/types/api'

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

// eslint-disable-next-line func-names
Then('the data products are displayed', function (this: Mocha.Context) {
  const page = Page.verifyOnPage(ReportsPage)
  getReportDefinitions(this).then(reportDefinitions => {
    reportDefinitions.forEach(report => {
      page.card(report.id).should('not.be.null')
    })
  })
})
