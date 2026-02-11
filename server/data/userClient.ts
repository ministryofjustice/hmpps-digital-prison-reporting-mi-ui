import logger from '../../logger'
import { ApiConfig } from '../config'
import RestClient from './restClient'

export default class UserClient {
  restClient: RestClient
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  getActiveCaseload(token: string): Promise<string> {
    logger.info(`User client: Get user's active caseload`)

    if (!this.restClient) {
      this.restClient = new RestClient('User API Client', this.config, token)
    }
    return this.restClient
      .get({
        path: `/user/caseload/active`,
      })
      .then(response => (<Array<string>>response)[0])
  }
}
