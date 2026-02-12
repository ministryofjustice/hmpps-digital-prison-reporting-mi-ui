import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'
import process from 'process'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { Services } from '../../services'
import populateDefinitions from '../../middleware/populateDefinitions'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { unauthorisedRoutes } from '../unauthorisedRoutes'
import { AppFeatureFlagService } from '../../services/featureFlagService'

export const user = {
  firstName: 'first',
  lastName: 'last',
  userId: 'id',
  token: 'token',
  username: 'user1',
  display: 'First Last',
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const cwd = process.cwd()
  const layoutPath = `${cwd}/dist/server/views/partials/layout.njk`
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {
      bookmarkingEnabled: true,
      collectionsEnabled: true,
      csrfToken: '',
      definitions: [],
      definitionsPath: '',
      downloadingEnabled: true,
      dpdPathFromConfig: true,
      dpdPathFromQuery: true,
      dprUser: {
        ...req.user,
        id: 'dprUser',
      },
      featureFlags: {
        flags: {},
        lastUpdated: 0,
      },
      nestedBaseUrl: '',
      requestMissingEnabled: true,
      saveDefaultsEnabled: true,
    }
    res.locals.user = { ...req.user }
    next()
  })
  app.use(unauthorisedRoutes(services.appFeatureFlagService))
  app.use(asyncMiddleware(populateDefinitions(services.reportingService)))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services, layoutPath))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

const featureFlagService = new AppFeatureFlagService()

const requestedReportService = {
  getAllReports: jest.fn().mockResolvedValue(Promise.resolve([])),
}

const downloadPermissionService = {
  enabled: true,
}

export function appWithAllRoutes({
  production = false,
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()

  const servicesWithMissingMocked: Services = {
    ...services,
    downloadPermissionService: services.downloadPermissionService ?? downloadPermissionService,
    requestedReportService: services.requestedReportService ?? requestedReportService,
    appFeatureFlagService: services.featureFlagService ?? featureFlagService,
  } as Services

  return appSetup(servicesWithMissingMocked, production, userSupplier)
}
