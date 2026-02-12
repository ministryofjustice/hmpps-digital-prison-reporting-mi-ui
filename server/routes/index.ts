import { Router } from 'express'

import { initCatalogue } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/catalogueUtils'
import { initUserReports } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/userReportsListUtils'
import { routes as dprPlatformRoutes } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/routes'

import process from 'process'
import fs from 'fs'
import type { Services } from '../services'
import { routerGet } from './routerGet'

export default function routes(services: Services, layoutPath: string): Router {
  const router = Router()
  const get = routerGet(router)

  get('/', async (_req, res) => {
    const catalogue = await initCatalogue({ res, services })
    const userReportsLists = await initUserReports({ res, services })

    res.render('pages/home', {
      title: 'Digital Prison Reporting',
      userReportsLists,
      catalogue,
    })
  })

  const cwd = process.cwd()
  if (!fs.existsSync(cwd)) {
    throw Error(`cwd given does not exist or was not valid`)
  }

  router.use(
    '/',
    dprPlatformRoutes({
      services,
      layoutPath,
    }),
  )

  router.use('/accessibility-statement', (req, res) => {
    res.render('pages/accessibility-statement')
  })

  return router
}
