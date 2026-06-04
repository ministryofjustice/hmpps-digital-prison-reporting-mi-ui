import { RequestHandler } from 'express'
import type { Request, Response, NextFunction } from 'express'
import logger from '../../logger'
import { Services } from '../services'

export default function populateSystemToken(services: Services): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { systemTokenService } = services
      if (!systemTokenService.enabled) {
        logger.info(`systemToken: disabled`)
      } else if (res.locals.user) {
        const { user } = res.locals
        const { dprUser } = res.locals
        const systemToken = res.locals.user && (await systemTokenService.getSystemToken(user.username))
        if (systemToken) {
          res.locals.systemToken = systemToken
          // override the token on the dpruser as this gets picked up by localsHelper.getValues
          dprUser.token = systemToken
          res.locals.dprUser = dprUser
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve system token for user: ${res.locals.user && res.locals.user.username}`)
    }
  }
}
