import { type RequestHandler, Router } from 'express'

import CardUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/card-group/utils'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import addReportingRoutes from './reports'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => {
    res.render('pages/card', {
      title: 'Home',
      cards: [
        {
          text: 'Reports',
          href: '/reports',
          description: 'View MI reports',
        },
      ],
    })
  })

  get('/reports', (req, res) => {
    res.render('pages/card', {
      title: 'Reports',
      cards: CardUtils.reportDefinitionsToCards(res.locals.definitions, '/reports'),
    })
  })

  get('/maintenance', (req, res) => {
    res.render('pages/maintenance', {
      title: 'Site Maintenance',
    })
  })

  addReportingRoutes(router, services)

  return router
}
