import { type RequestHandler, Router } from 'express'

import addAsyncReportingRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/asyncReports'
import AsyncReportslistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/async-reports-list/utils'

import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
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
    res.render('pages/home', {
      title: 'Home',
      ...(await AsyncReportslistUtils.renderList({
        recentlyViewedStoreService: services.recentlyViewedStoreService,
        asyncReportsStore: services.asyncReportsStore,
        dataSources: services.reportingService,
        res,
        maxRows: 6,
      })),
      reports: res.locals.definitions.flatMap((d: components['schemas']['ReportDefinitionSummary']) =>
        d.variants.map(v => [
          { text: d.name },
          { html: `<a href="/async-reports/${d.id}/${v.id}/request${res.locals.pathSuffix}">${v.name}</a>` },
        ]),
      ),
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

  addReportingRoutes(router, services)
  addAsyncReportingRoutes({
    router,
    asyncReportsStore: services.asyncReportsStore,
    recentlyViewedStoreService: services.recentlyViewedStoreService,
    dataSources: services.reportingService,
    layoutPath: '../../../../../dist/server/views/partials/layout.njk',
    templatePath: 'dpr/views/',
  })

  return router
}
