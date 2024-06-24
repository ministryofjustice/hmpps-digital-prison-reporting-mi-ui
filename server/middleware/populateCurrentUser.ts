import { RequestHandler } from 'express'
import AsyncReportStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/requestedReportsService'
import RecentlyViewedStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/recentlyViewedService'
import logger from '../../logger'
import UserService from '../services/userService'

export default function populateCurrentUser(
  userService: UserService,
  asyncReportsStore: AsyncReportStoreService,
  recentlyViewedStoreService: RecentlyViewedStoreService,
): RequestHandler {
  return async (req, res, next) => {
    try {
      if (!req.session.userDetails) {
        const userDetails = res.locals.user && (await userService.getUser(res.locals.user.token))
        if (userDetails) {
          req.session.userDetails = userDetails
        } else {
          logger.info('No user details retrieved')
        }
      }
      res.locals.user = { ...req.session.userDetails, ...res.locals.user }
      asyncReportsStore.init(res.locals.user.name)
      recentlyViewedStoreService.init(res.locals.user.name)
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for : ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}
