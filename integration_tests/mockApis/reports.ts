import { stubFor } from './wiremock'

const externalMovementsCount = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/external-movements/count',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"count": 1234}',
    },
  })

export default {
  stubExternalMovementsCount: externalMovementsCount,
}
