import type ReportingClient from '../data/reportingClient'
import type { ListRequest } from '../types/reports'

export default class ReportingService {
  constructor(private readonly reportingClient: ReportingClient) {}

  async getCount(resourceName: string, token: string): Promise<number> {
    return this.reportingClient.getCount(resourceName, token)
  }

  async getList(resourceName: string, token: string, listRequest: ListRequest): Promise<Array<NodeJS.Dict<string>>> {
    return this.reportingClient.getList(resourceName, token, listRequest)
  }
}
