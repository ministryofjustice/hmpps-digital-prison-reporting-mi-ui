import { ApiConfig } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/types'
import RestClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/restClient'
import logger from '../../logger'

export default class UserClient {
  restClient: RestClient

  constructor(config: ApiConfig) {
    this.restClient = new RestClient('User API Client', config)
  }

  getActiveCaseload(token: string): Promise<string> {
    logger.info(`User client: Get user's active caseload`)

    return this.restClient
      .get({
        path: `/user/caseload/active`,
        token,
      })
      .then(response => (<Array<string>>response)[0])
  }
}
