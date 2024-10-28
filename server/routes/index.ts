import { type RequestHandler, Router } from 'express'

import addAsyncReportingRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/asyncReports'
import addBookmarkingRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/bookmarks'
import addDashboardRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/dashboard'
import addDownloadRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/download'
import addRecentlyViewedRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/recentlyViewed'
import UserReportsListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/utils'
import RecentlyViewedUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports-viewed-list/utils'
import RequestedReportsUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports-request-list/utils'
import BookmarklistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports-bookmarks-list/utils'
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
    const requestedReportsData = await UserReportsListUtils.renderList({
      res,
      storeService: services.requestedReportService,
      maxRows: 6,
      filterFunction: RequestedReportsUtils.filterReports,
      type: 'requested',
    })

    const recentlyViewedData = await UserReportsListUtils.renderList({
      res,
      storeService: services.recentlyViewedService,
      maxRows: 6,
      filterFunction: RecentlyViewedUtils.filterReports,
      type: 'requested',
    })

    const bookmarks = await BookmarklistUtils.renderBookmarkList({
      res,
      req,
      services,
      maxRows: 6,
    })

    const reportsData = await ReportslistUtils.mapReportsList(res, services)

    res.render('pages/home', {
      title: 'Digital Prison Reporting',
      requestedReports: requestedReportsData,
      viewedReports: recentlyViewedData,
      bookmarks,
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
  addDownloadRoutes(libRouteParams)

  // // // // // // // //
  return router
}
