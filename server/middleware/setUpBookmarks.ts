import { RequestHandler } from 'express'
import BookmarkUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/bookmarkUtils'
import logger from '../../logger'
import { Services } from '../services'
import config from '../config'

export default function setUpBookmarks(services: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user && !req.session.bookmarksInitialised) {
        const { uuid, activeCaseLoadId, staffId } = res.locals.user
        const { automaticBookmarkConfig } = config.dpr

        if (automaticBookmarkConfig.staffIds.includes(staffId)) {
          logger.info(` Initialising bookmarks for user: ${res.locals.user && res.locals.user.username}`)

          await BookmarkUtils.preBookmarkReportsByRoleId(
            uuid,
            activeCaseLoadId,
            services,
            automaticBookmarkConfig.caseloads,
          )
        }
        req.session.bookmarksInitialised = true
      }
      return next()
    } catch (error) {
      logger.error(error, `Failed to initialise bookmarks : ${res.locals.user && res.locals.user.username}`)
      return next(error)
    }
  }
}
