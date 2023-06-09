import ReportingClient from '../data/reportingClient'
import ReportingService from './reportingService'
import Dict = NodeJS.Dict

jest.mock('../data/reportingClient')

describe('Reporting service', () => {
  let reportingClient: jest.Mocked<ReportingClient>
  let reportingService: ReportingService

  beforeEach(() => {
    reportingClient = new ReportingClient() as jest.Mocked<ReportingClient>
    reportingService = new ReportingService(reportingClient)
  })

  describe('getCount', () => {
    it('Retrieves count from client', async () => {
      const expectedCount = 456
      reportingClient.getCount.mockResolvedValue(expectedCount)

      const result = await reportingService.getCount(null, null, {})

      expect(result).toEqual(expectedCount)
    })
  })

  describe('getList', () => {
    it('Retrieves list from client', async () => {
      const expectedResponse: Array<Dict<string>> = [{ test: 'true' }]
      reportingClient.getList.mockResolvedValue(expectedResponse)

      const result = await reportingService.getList(null, null, null)

      expect(result).toEqual(expectedResponse)
    })
  })
})
