import { RequestHandler } from 'express'
import { DprUser } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dprUser'
import logger from '../../logger'
import { Services } from '../services'

export default function populateCurrentUser(services: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const user = await services.userService.getUser(res.locals.user.token)

        // NOTE: BE type says this is a string, but its actually an object, so have to cast it
        const activeCaseLoad = user.activeCaseLoadId as unknown as { id: string } | undefined

        if (user) {
          const dprUser = new DprUser()
          dprUser.token = res.locals.user.token
          dprUser.id = user.uuid
          dprUser.activeCaseLoadId = activeCaseLoad?.id
          dprUser.emailAddress = user.email
          dprUser.displayName = user.displayName
          res.locals.user = { ...user, ...res.locals.user }
          req.session.userDetails = res.locals.user
          res.locals.dprUser = dprUser
        } else {
          logger.info('No user available')
        }
      }
      return next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for : ${res.locals.user && res.locals.user.username}`)
      return next(error)
    }
  }
}
