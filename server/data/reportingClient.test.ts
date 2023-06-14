import nock from 'nock'

import config from '../config'
import ReportingClient from './reportingClient'

describe('reportingClient', () => {
  let fakeReportingApi: nock.Scope
  let reportingClient: ReportingClient

  beforeEach(() => {
    fakeReportingApi = nock(config.apis.reporting.url)
    reportingClient = new ReportingClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getExternalMovementsCount', () => {
    it('should return data from api', async () => {
      const response = { count: 123 }

      fakeReportingApi.get('/external-movements/count').reply(200, response)

      const output = await reportingClient.getExternalMovementsCount()
      expect(output).toEqual(response.count)
    })
  })
})
