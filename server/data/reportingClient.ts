import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface Count {
  count: number
}

export default class ReportingClient {
  private static restClient(): RestClient {
    return new RestClient('Reporting API Client', config.apis.reporting, null)
  }

  getExternalMovementsCount(): Promise<number> {
    logger.info('Reporting client: Get external movements')

    return ReportingClient.restClient()
      .get({ path: '/external-movements/count' })
      .then(response => (<Count>response).count)
  }
}
