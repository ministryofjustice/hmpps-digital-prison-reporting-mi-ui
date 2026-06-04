import logger from '../../logger'
import HmppsAuthClient from '../data/hmppsAuthClient'

export default class SystemTokenService {
  enabled: boolean

  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    enabled: boolean,
  ) {
    this.enabled = enabled
    logger.info(`systemTokenService: enabled=${enabled}`)
  }

  async getSystemToken(userName: string): Promise<string> {
    if (!this.enabled) {
      logger.info(`systemToken: disabled`)
      return undefined
    }

    const token = this.hmppsAuthClient.getSystemClientToken(userName)

    return token
  }
}
