import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface Count {
  count: number
}

export default class ReportingClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Reporting API Client', config.apis.reporting, token)
  }

  getExternalMovementsCount(token: string): Promise<number> {
    logger.info('Reporting client: Get external movements')

    return ReportingClient.restClient(token)
      .get({ path: '/external-movements/count' })
      .then(response => (<Count>response).count)
  }

  getEstablishmentsCount(token: string): Promise<number> {
    logger.info('Reporting client: Get external movements')

    return ReportingClient.restClient(token)
      .get({ path: '/establishments/count' })
      .then(response => (<Count>response).count)
  }
}
