import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'
import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration }

  /** Add a static asset route */
  function staticRoute(assetUrl: string, assetPath: string): void {
    router.use(
      assetUrl,
      express.static(path.join(process.cwd(), assetPath), {
        maxAge: config.staticResourceCacheDuration,
        redirect: false,
      }),
    )
  }

  Array.of(
    '/dist/assets',
    '/dist/assets/stylesheets',
    '/dist/assets/js',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/assets',
    '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  staticRoute('/moj/assets', '/node_modules/@ministryofjustice/frontend/moj/assets')
  staticRoute('/assets/dpr', '/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/assets')

  Array.of('/node_modules/govuk_frontend_toolkit/images').forEach(dir => {
    router.use('/assets/images/icons', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
