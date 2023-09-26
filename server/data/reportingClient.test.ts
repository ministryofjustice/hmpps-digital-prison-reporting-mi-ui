import nock from 'nock'

import config from '../config'
import ReportingClient from './reportingClient'
import { components } from '../types/api'
import { ReportQuery } from '../types/reports/class'

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

      const output = await reportingClient.getCount(resourceName, null, {})
      expect(output).toEqual(response.count)
    })
  })

  describe('getList', () => {
    it('should return data from api', async () => {
      const response = [{ test: 'true' }]
      const listRequest: ReportQuery = new ReportQuery(
        [
          {
            name: 'original.filter',
            displayName: 'Original',
            sortable: true,
            defaultSortColumn: false,
            filter: {
              type: 'Radio',
            },
            type: 'String',
          },
        ],
        {
          selectedPage: '1',
          pageSize: '2',
          sortColumn: 'three',
          sortedAsc: 'true',
          'f.original.filter': 'true',
        },
        'one',
        'f.',
      )

      const expectedQuery: Record<string, string> = {
        selectedPage: '1',
        pageSize: '2',
        sortColumn: 'three',
        sortedAsc: 'true',
        'f.original.filter': 'true',
      }
      const resourceName = 'external-movements'

      fakeReportingApi.get(`/${resourceName}`).query(expectedQuery).reply(200, response)

      const output = await reportingClient.getList(resourceName, null, listRequest)
      expect(output).toEqual(response)
    })
  })

  describe('getDefinitions', () => {
    it('should return definitions from api', async () => {
      const response: Array<components['schemas']['ReportDefinition']> = [
        {
          id: 'test-report',
          name: 'Test report',
          variants: [],
        },
      ]
      const query = {
        renderMethod: 'HTML',
      }

      fakeReportingApi.get(`/definitions`).query(query).reply(200, response)

      const output = await reportingClient.getDefinitions(null)
      expect(output).toEqual(response)
    })
  })
})
