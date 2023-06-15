import { stubFor } from './wiremock'

const stubExternalMovementsCount = () =>
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

const stubEstablishmentsCount = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/establishments/count',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"count": 5678}',
    },
  })

export default {
  stubExternalMovementsCount,
  stubEstablishmentsCount,
}
