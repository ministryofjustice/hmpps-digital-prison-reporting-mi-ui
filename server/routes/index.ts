import { type RequestHandler, Router } from 'express'

import addAsyncReportingRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/asyncReports'
import addBookmarkingRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/bookmarks'
import addDashboardRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/dashboard'
import addRecentlyViewedRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/recentlyViewed'
import AsyncRequestlistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/async-request-list/utils'
import RecentlyViewedUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/recently-viewed-list/utils'
import BookmarklistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/bookmarkListUtils'
import ReportslistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/reports-list/utils'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import addReportingRoutes from './reports'
import config from '../config'

interface ServiceActiveAgencies {
  app: string
  activeAgencies: string[]
}

const applicationInfo: ServiceActiveAgencies = {
  app: 'Digital Prison Reporting',
  activeAgencies: config.activeEstablishments,
}

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const utilsParams = { services, res }
    const requestedReportsData = await AsyncRequestlistUtils.renderList({ ...utilsParams, maxRows: 6 })
    const recentlyViewedData = await RecentlyViewedUtils.renderRecentlyViewedList({ ...utilsParams, maxRows: 6 })
    const bookmarksData = await BookmarklistUtils.renderBookmarkList({ ...utilsParams, maxRows: 6, req })
    const reportsData = ReportslistUtils.mapReportsList(res, services)

    res.render('pages/home', {
      title: 'Digital Prison Reporting',
      requestedReports: requestedReportsData,
      viewedReports: recentlyViewedData,
      bookmarks: bookmarksData,
      reports: reportsData,
    })
  })

  get('/maintenance', (req, res) => {
    res.render('pages/maintenance', {
      title: 'Site Maintenance',
      description: config.maintenanceMode,
    })
  })

  get('/info', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(applicationInfo))
  })

  const libRouteParams = {
    router,
    services,
    layoutPath: '../../../../../dist/server/views/partials/layout.njk',
    templatePath: 'dpr/views/',
  }

  addReportingRoutes(router, services)
  addAsyncReportingRoutes(libRouteParams)
  addRecentlyViewedRoutes(libRouteParams)
  addBookmarkingRoutes(libRouteParams)
  addDashboardRoutes(libRouteParams)

  return router
}
