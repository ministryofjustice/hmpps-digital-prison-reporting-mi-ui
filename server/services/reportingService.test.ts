import ReportingClient from '../data/reportingClient'
import ReportingService from './reportingService'

jest.mock('../data/reportingClient')

describe('Reporting service', () => {
  let reportingClient: jest.Mocked<ReportingClient>
  let reportingService: ReportingService

  describe('getExternalMovementsCount', () => {
    beforeEach(() => {
      reportingClient = new ReportingClient() as jest.Mocked<ReportingClient>
      reportingService = new ReportingService(reportingClient)
    })

    it('Retrieves vount from client', async () => {
      reportingClient.getExternalMovementsCount.mockResolvedValue(456)

      const result = await reportingService.getExternalMovementsCount()

      expect(result).toEqual(456)
    })
  })
})
