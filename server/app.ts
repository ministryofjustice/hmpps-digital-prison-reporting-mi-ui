import express from 'express'

import path from 'path'
import createError from 'http-errors'

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
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
import config from './config'

import routes from './routes'
import type { Services } from './services'
import populateCurrentPageLocation from './middleware/populateCurrentPageLocation'
import populateDefinitions from './middleware/populateDefinitions'
import asyncMiddleware from './middleware/asyncMiddleware'
import getFrontendComponents from './middleware/getFrontendComponents'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(metricsMiddleware)
  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(siteMaintenanceRedirect())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware(config.authorisation.roles))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(asyncMiddleware(populateDefinitions(services.reportingService)))
  app.use(populateCurrentPageLocation())
  app.get('*', getFrontendComponents(services.hmppsComponentsService))

  app.use(routes(services))
  app.use(cookieParser())
  app.use(bodyParser.json())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
