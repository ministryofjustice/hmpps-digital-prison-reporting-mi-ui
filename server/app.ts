import express from 'express'

import path from 'path'
import createError from 'http-errors'

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import setUpDprResources from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/middleware/setUpDprResources'
import * as Sentry from '@sentry/node'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { metricsMiddleware } from './monitoring/metricsApp'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import siteMaintenanceRedirect from './middleware/siteMaintenanceRedirect'

import './sentry'
import sentryMiddleware from './middleware/sentryMiddleware'

import routes from './routes'
import type { Services } from './services'
import populateCurrentPageLocation from './middleware/populateCurrentPageLocation'
import getFrontendComponents from './middleware/getFrontendComponents'
import config from './config'
import setUpBookmarks from './middleware/setUpBookmarks'
import { appInsightsMiddleware } from './utils/azureAppInsights'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(sentryMiddleware())
  app.use(appInsightsMiddleware())

  // @ts-expect-error Return type defined for promBundle() is inconsistent with Express middleware type definitions
  app.use(metricsMiddleware)
  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(siteMaintenanceRedirect())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(setUpBookmarks(services))
  app.use(setUpDprResources(services, config.dpr))
  app.use(populateCurrentPageLocation())
  app.use(getFrontendComponents(services.hmppsComponentsService))
  app.use(routes(services))
  if (config.sentry.dsn) Sentry.setupExpressErrorHandler(app)
  app.use(cookieParser())
  app.use(bodyParser.json())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
