import { stubFor } from './wiremock'

const externalMovementsCount = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/external-movements/count',
    },
    response: {
      status: 200,
      body: '{"count": 1234}',
    },
  })

export default {
  stubExternalMovementsCount: externalMovementsCount(),
}
