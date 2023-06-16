import type ReportingClient from '../data/reportingClient'

export default class ReportingService {
  constructor(private readonly reportingClient: ReportingClient) {}

  async getExternalMovementsCount(token: string): Promise<number> {
    return this.reportingClient.getExternalMovementsCount(token)
  }

  async getEstablishmentsCount(token: string): Promise<number> {
    return this.reportingClient.getEstablishmentsCount(token)
  }
}
