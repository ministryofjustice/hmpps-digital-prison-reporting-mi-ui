import { type RequestHandler, Router } from 'express'

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
      cards: [
        {
          text: 'External movements',
          href: '/reports/external-movements',
          description: 'View external movements',
        },
      ],
    })
  })

  addReportingRoutes(router, services)

  return router
}
