import ReportQuery from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/ReportQuery'
import { components, operations } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'
import Dict = NodeJS.Dict

export interface Count {
  count: number
}

export default class ReportingClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Reporting API Client', config.apis.reporting, token)
  }

  getCount(resourceName: string, token: string, listRequest: ReportQuery): Promise<number> {
    logger.info(`Reporting client: Get ${resourceName} count`)

    return ReportingClient.restClient(token)
      .get({
        path: `/${resourceName}/count`,
        query: listRequest.toRecordWithFilterPrefix(),
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
