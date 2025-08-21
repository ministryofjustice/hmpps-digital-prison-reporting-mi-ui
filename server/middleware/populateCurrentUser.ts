import { RequestHandler } from 'express'
import logger from '../../logger'
import { Services } from '../services'

export default function populateCurrentUser(services: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const user = await services.userService.getUser(res.locals.user.token)
        if (user) {
          res.locals.user = { ...user, ...res.locals.user }
          req.session.userDetails = res.locals.user
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
