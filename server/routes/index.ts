import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => {
    res.render('pages/card-page', {
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

  get('/reports', (req, res, next) => {
    Promise.all([
      services.reportingService.getExternalMovementsCount(res.locals.user.token),
      services.reportingService.getEstablishmentsCount(res.locals.user.token),
    ])
      .then(counts => {
        res.render('pages/card-page', {
          title: 'Reports',
          cards: [
            {
              text: counts[0],
              href: '#external-movements',
              description: 'Total number of external movements - mocked API call',
            },
            {
              text: counts[1],
              href: '#establishments',
              description: 'Total number of establishments - retrieved from RedShift',
            },
          ],
        })
      })
      .catch(err => next(err))
  })

  return router
}
