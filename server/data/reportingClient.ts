import * as querystring from 'querystring'
import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'
import Dict = NodeJS.Dict
import type { ListRequest } from '../types/reports'
import { toRecord } from '../types/reports/class'

export interface Count {
  count: number
}

export default class ReportingClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Reporting API Client', config.apis.reporting, token)
  }

  getCount(resourceName: string, token: string): Promise<number> {
    logger.info(`Reporting client: Get ${resourceName} count`)

    return ReportingClient.restClient(token)
      .get({ path: `/${resourceName}/count` })
      .then(response => (<Count>response).count)
  }

  getList(resourceName: string, token: string, listRequest: ListRequest): Promise<Array<Dict<string>>> {
    logger.info(`Reporting client: Get ${resourceName} list`)

    return ReportingClient.restClient(token)
      .get({
        path: `/${resourceName}`,
        query: querystring.stringify(toRecord(listRequest)),
      })
      .then(response => <Array<Dict<string>>>response)
  }
}
