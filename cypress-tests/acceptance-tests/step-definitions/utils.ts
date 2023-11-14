import { components } from '../../../server/types/api'

export const getAccessTokenFromHmppsAuth = () => {
  return cy
    .request({
      url: `https://${Cypress.env(
        'SIGN_IN_URL',
      )}/auth/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2F${Cypress.env(
        'UI_URL',
      )}%2Fsign-in%2Fcallback&state=X&client_id=${Cypress.env('CLIENT_ID')}`,
      followRedirect: false,
    })
    .then(resp => {
      expect(resp.status).to.eq(303)

      return /code=(.+)&/.exec(resp.redirectedToUrl).pop()
    })
    .then(code => {
      return cy.request({
        url: `https://${Cypress.env('SIGN_IN_URL')}/auth/oauth/token`,
        auth: {
          username: Cypress.env('CLIENT_ID'),
          password: Cypress.env('CLIENT_SECRET'),
        },
        method: 'POST',
        qs: {
          grant_type: 'authorization_code',
          code,
          client_id: Cypress.env('CLIENT_ID'),
          redirect_uri: 'https://digital-prison-reporting-mi-ui-dev.hmpps.service.justice.gov.uk/sign-in/callback',
        },
      })
    })
    .then(resp => resp.body.access_token)
}

export const getReportDefinitions = (context: Mocha.Context) => {
  if (!context.reportDefinitions) {
    return getAccessTokenFromHmppsAuth().then(code => {
      return cy
        .request({
          url: `${Cypress.env('API_BASE_URL')}/definitions?renderMethod=HTML`,
          auth: {
            bearer: code,
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
