import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import ReportingClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/reportingClient'
import ReportQuery from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/ReportQuery'
import Dict = NodeJS.Dict
import ReportingService from './reportingService'

jest.mock('@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/reportingClient')

describe('Reporting service', () => {
  let reportingClient: jest.Mocked<ReportingClient>
  let reportingService: ReportingService

  const mockConfig = {
    url: '',
    agent: {
      timeout: 0,
    },
  }

  beforeEach(() => {
    reportingClient = new ReportingClient(mockConfig) as jest.Mocked<ReportingClient>
    reportingService = new ReportingService(reportingClient)
  })

  describe('getCount', () => {
    it('Retrieves count from client', async () => {
      const expectedCount = 456
      reportingClient.getCount.mockResolvedValue(expectedCount)

      const result = await reportingService.getCount('resource', 'token', {} as unknown as ReportQuery)

      expect(result).toEqual(expectedCount)
    })
  })

  describe('getList', () => {
    it('Retrieves list from client', async () => {
      const expectedResponse: Array<Dict<string>> = [{ test: 'true' }]
      reportingClient.getList.mockResolvedValue(expectedResponse)

      const result = await reportingService.getList('resource', 'token', {} as unknown as ReportQuery)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('getDefinitions', () => {
    it('Retrieves definitions from client', async () => {
      const expectedResponse: Array<components['schemas']['ReportDefinitionSummary']> = [
        {
          id: 'test-report',
          name: 'Test report',
          variants: [],
          authorised: false,
        },
      ]
      reportingClient.getDefinitions.mockResolvedValue(expectedResponse)

      const result = await reportingService.getDefinitions('null')

      expect(result).toEqual(expectedResponse)
    })
  })
})
