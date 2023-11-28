import ReportQuery from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/ReportQuery'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import type ReportingClient from '../data/reportingClient'

export default class ReportingService {
  constructor(private readonly reportingClient: ReportingClient) {}

  async getCount(resourceName: string, token: string, listRequest: ReportQuery): Promise<number> {
    return this.reportingClient.getCount(resourceName, token, listRequest)
  }

  async getList(resourceName: string, token: string, listRequest: ReportQuery): Promise<Array<NodeJS.Dict<string>>> {
    return this.reportingClient.getList(resourceName, token, listRequest)
  }

  async getDefinitions(token: string): Promise<Array<components['schemas']['ReportDefinition']>> {
    return this.reportingClient.getDefinitions(token)
  }
}
