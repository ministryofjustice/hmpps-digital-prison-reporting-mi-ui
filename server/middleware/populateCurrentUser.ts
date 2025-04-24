import { RequestHandler } from 'express'
import logger from '../../logger'
import { Services } from '../services'

export default function populateCurrentUser(services: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      if (!req.session.userDetails) {
        const userDetails = res.locals.user && (await services.userService.getUser(res.locals.user.token))
        if (userDetails) {
          req.session.userDetails = userDetails
        } else {
          logger.info('No user details retrieved')
        }
      }
      res.locals.user = { ...req.session.userDetails, ...res.locals.user }
      return next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for : ${res.locals.user && res.locals.user.username}`)
      return next(error)
    }
  }
}
