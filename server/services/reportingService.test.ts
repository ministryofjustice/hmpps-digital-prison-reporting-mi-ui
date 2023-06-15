import ReportingClient from '../data/reportingClient'
import ReportingService from './reportingService'

jest.mock('../data/reportingClient')

describe('Reporting service', () => {
  let reportingClient: jest.Mocked<ReportingClient>
  let reportingService: ReportingService

  beforeEach(() => {
    reportingClient = new ReportingClient() as jest.Mocked<ReportingClient>
    reportingService = new ReportingService(reportingClient)
  })

  describe('getExternalMovementsCount', () => {
    it('Retrieves count from client', async () => {
      const expectedCount = 456
      reportingClient.getExternalMovementsCount.mockResolvedValue(expectedCount)

      const result = await reportingService.getExternalMovementsCount()

      expect(result).toEqual(expectedCount)
    })
  })

  describe('getEstablishmentsCount', () => {
    it('Retrieves vount from client', async () => {
      const expectedCount = 789
      reportingClient.getEstablishmentsCount.mockResolvedValue(expectedCount)

      const result = await reportingService.getEstablishmentsCount()

      expect(result).toEqual(expectedCount)
    })
  })
})
