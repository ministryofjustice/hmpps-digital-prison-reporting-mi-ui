import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import addReportingRoutes from './reports'
import { components } from '../types/api'

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
      cards: res.locals.definitions.map((d: components['schemas']['ReportDefinition']) => ({
        text: d.name,
        href: `/reports/${d.id}`,
        description: d.description,
      })),
    })
  })

  addReportingRoutes(router, services)

  return router
}
