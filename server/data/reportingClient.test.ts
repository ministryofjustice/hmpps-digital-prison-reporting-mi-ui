import nock from 'nock'

import config from '../config'
import ReportingClient from './reportingClient'
import type { FilteredListRequest } from '../types/reports'

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

  describe('getCount', () => {
    it('should return data from api', async () => {
      const response = { count: 123 }
      const resourceName = 'external-movements'

      fakeReportingApi.get(`/${resourceName}/count`).reply(200, response)

      const output = await reportingClient.getCount(resourceName, null, {}, {})
      expect(output).toEqual(response.count)
    })
  })

  describe('getList', () => {
    it('should return data from api', async () => {
      const response = [{ test: 'true' }]
      const listRequest: FilteredListRequest = {
        selectedPage: 1,
        pageSize: 2,
        sortColumn: 'three',
        sortedAsc: true,
        filters: {
          'original.filter': 'true',
        },
      }
      const expectedQuery: Record<string, string> = {
        selectedPage: '1',
        pageSize: '2',
        sortColumn: 'three',
        sortedAsc: 'true',
        updatedFilter: 'true',
      }
      const resourceName = 'external-movements'

      fakeReportingApi.get(`/${resourceName}`).query(expectedQuery).reply(200, response)

      const output = await reportingClient.getList(resourceName, null, listRequest, {
        'original.filter': 'updatedFilter',
      })
      expect(output).toEqual(response)
    })
  })
})
