import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'
import Dict = NodeJS.Dict
import { ReportQuery } from '../types/reports/class'
import { components, operations } from '../types/api'

export interface Count {
  count: number
}

export default class ReportingClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Reporting API Client', config.apis.reporting, token)
  }

  getCount(resourceName: string, token: string, filters: Dict<string>): Promise<number> {
    logger.info(`Reporting client: Get ${resourceName} count`)

    return ReportingClient.restClient(token)
      .get({
        path: `/${resourceName}/count`,
        query: filters,
      })
      .then(response => (<Count>response).count)
  }

  getList(resourceName: string, token: string, listRequest: ReportQuery): Promise<Array<Dict<string>>> {
    logger.info(`Reporting client: Get ${resourceName} list`)

    return ReportingClient.restClient(token)
      .get({
        path: `/${resourceName}`,
        query: listRequest.toRecordWithFilterPrefix(),
      })
      .then(response => <Array<Dict<string>>>response)
  }

  getDefinitions(token: string): Promise<Array<components['schemas']['ReportDefinition']>> {
    logger.info(`Reporting client: Get definitions`)

    const params: operations['definitions']['parameters'] = {
      query: {
        renderMethod: 'HTML',
      },
    }

    return ReportingClient.restClient(token)
      .get({
        path: '/definitions',
        query: params.query,
      })
      .then(response => <Array<components['schemas']['ReportDefinition']>>response)
  }
}
