import { RequestHandler } from 'express'
import AsyncReportStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/requestedReportsService'
import RecentlyViewedStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/recentlyViewedService'
import BookmarkService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/bookmarkService'
import logger from '../../logger'
import UserService from '../services/userService'

export default function populateCurrentUser(
  userService: UserService,
  asyncReportsStore: AsyncReportStoreService,
  recentlyViewedStoreService: RecentlyViewedStoreService,
  bookmarkService: BookmarkService,
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
      await asyncReportsStore.init(req.session.userDetails.uuid)
      await recentlyViewedStoreService.init(req.session.userDetails.uuid)
      await bookmarkService.init(req.session.userDetails.uuid)

      if (req.session.userDetails && userService.userIsUnauthorisedByRole(res.locals.user.roles)) {
        return res.redirect('/roleError')
      }
      return next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for : ${res.locals.user && res.locals.user.username}`)
      return next(error)
    }
  }
}
