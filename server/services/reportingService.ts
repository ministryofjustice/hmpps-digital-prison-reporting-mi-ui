import type ReportingClient from '../data/reportingClient'
import type { FilteredListRequest } from '../types/reports'
import Dict = NodeJS.Dict

export default class ReportingService {
  constructor(private readonly reportingClient: ReportingClient) {}

  async getCount(
    resourceName: string,
    token: string,
    filters: Dict<string>,
    apiFieldNameOverrides: Dict<string>,
  ): Promise<number> {
    return this.reportingClient.getCount(resourceName, token, filters, apiFieldNameOverrides)
  }

  async getList(
    resourceName: string,
    token: string,
    listRequest: FilteredListRequest,
    apiFieldNameOverrides: Dict<string>,
  ): Promise<Array<NodeJS.Dict<string>>> {
    return this.reportingClient.getList(resourceName, token, listRequest, apiFieldNameOverrides)
  }
}
