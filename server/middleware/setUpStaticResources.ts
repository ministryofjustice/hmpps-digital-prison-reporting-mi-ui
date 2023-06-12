import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

const jsStaticResources = [
  {
    path: '/assets/js/jquery.min.js',
    location: '/node_modules/jquery/dist/jquery.min.js',
  },
  {
    path: '/assets/js/jquery-ui.min.js',
    location: '/node_modules/jquery-ui/dist/jquery-ui.min.js',
  },
  {
    path: '/assets/js/jquery-ui.min.css',
    location: '/node_modules/jquery-ui/dist/themes/ui-lightness/jquery-ui.min.css',
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
    '/node_modules/govuk-frontend/govuk/assets',
    '/node_modules/govuk-frontend',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/jquery/dist',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  Array.of('/node_modules/govuk_frontend_toolkit/images').forEach(dir => {
    router.use('/assets/images/icons', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  jsStaticResources.forEach(r => {
    router.use(r.path, express.static(path.join(process.cwd(), r.location), cacheControl))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
