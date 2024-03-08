import { type RequestHandler, Router } from 'express'

import CardUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/card-group/utils'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import addReportingRoutes from './reports'
import config from '../config'
import { getDefinitionsParameters } from '../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => {
    res.render('pages/card', {
      title: 'Home',
      cards: {
        items: [
          {
            text: 'Reports',
            href: `/reports${res.locals.pathSuffix}`,
            description: 'View MI reports',
          },
        ],
        variant: 1,
      },
    })
  })

  get('/reports', (req, res) => {
    res.render('pages/card', {
      title: 'Reports',
      breadCrumbList: [{ text: 'Home', href: `/${res.locals.pathSuffix}` }],
      cards: {
        items: CardUtils.reportDefinitionsToCards(
          res.locals.definitions,
          '/reports',
          getDefinitionsParameters(req.query),
        ),
        variant: 1,
      },
    })
  })

  get('/maintenance', (req, res) => {
    res.render('pages/maintenance', {
      title: 'Site Maintenance',
      description: config.maintenanceMode,
    })
  })

  addReportingRoutes(router, services)

  return router
}
