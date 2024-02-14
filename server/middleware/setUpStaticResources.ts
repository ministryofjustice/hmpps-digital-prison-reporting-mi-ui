import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

const otherStaticResources = [
  {
    path: '/assets/govuk/all.js',
    location: '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js',
  },
  {
    path: '/assets/dpr',
    location: '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/assets',
  },
]

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration }

  Array.of(
    '/assets',
    '/assets/stylesheets',
    '/assets/js',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  Array.of('/node_modules/govuk_frontend_toolkit/images').forEach(dir => {
    router.use('/assets/images/icons', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  otherStaticResources.forEach(r => {
    router.use(r.path, express.static(path.join(process.cwd(), r.location), cacheControl))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
