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

const stubExternalMovements = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/external-movements',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: '[]',
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
  stubExternalMovements,
  stubEstablishmentsCount,
}
