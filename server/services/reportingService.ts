import type ReportingClient from '../data/reportingClient'

export default class ReportingService {
  constructor(private readonly reportingClient: ReportingClient) {}

  async getExternalMovementsCount(): Promise<number> {
    return this.reportingClient.getExternalMovementsCount()
  }
}
