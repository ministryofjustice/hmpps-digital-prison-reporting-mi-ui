import { Router } from 'express'

import dprPlatformRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes'
import CatalogueUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/_catalogue/catalogue/utils'
import UserReportsListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/utils'

import process from 'process'
import fs from 'fs'
import type { Services } from '../services'
import addReportingRoutes from './reports'
import { routerGet } from './routerGet'

export default function routes(services: Services): Router {
  const router = Router()
  const get = routerGet(router)

  get('/', async (req, res) => {
    const catalogue = await CatalogueUtils.init({ res, services })
    const userReportsLists = await UserReportsListUtils.init({ res, services })

    res.render('pages/home', {
      title: 'Digital Prison Reporting',
      userReportsLists,
      catalogue,
    })
  })

  addReportingRoutes(router, services)
  const cwd = process.cwd()
  if (!fs.existsSync(cwd)) {
    throw Error(`cwd given does not exist or was not valid`)
  }

  router.use(
    '/',
    dprPlatformRoutes({
      services,
      layoutPath: `${cwd}/dist/server/views/partials/layout.njk`,
    }),
  )

  return router
}
