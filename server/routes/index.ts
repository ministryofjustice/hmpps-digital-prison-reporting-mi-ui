import { type RequestHandler, Router } from 'express'

import DprEmbeddedAsyncReports from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/DprEmbeddedReports'
import CatalogueUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/_catalogue/catalogue/utils'
import UserReportsListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/utils'

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
    const catalogue = await CatalogueUtils.init({ res, services })
    const userReportsLists = await UserReportsListUtils.init({ res, req, services })

    res.render('pages/home', {
      title: 'Digital Prison Reporting',
      userReportsLists,
      catalogue,
    })
  })

  get('/maintenance', (req, res) => {
    if (config.maintenanceMode.enabled) {
      res.render('pages/maintenance', {
        title: 'Site Maintenance',
        description: config.maintenanceMode.message,
      })
    } else {
      res.redirect('/')
    }
  })

  get('/info', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(applicationInfo))
  })

  addReportingRoutes(router, services)

  DprEmbeddedAsyncReports({
    router,
    services,
    layoutPath: '../../../../../dist/server/views/partials/layout.njk',
    config: config.dpr,
  })

  return router
}
