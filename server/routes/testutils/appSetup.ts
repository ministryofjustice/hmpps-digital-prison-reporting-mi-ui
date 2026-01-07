import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'
import process from 'process'

import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import ReportingClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/reportingClient'
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
    res.locals = {}
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

const reportingClient: jest.Mocked<ReportingClient> = {
  getListWithWarnings: jest.fn(),
  getDefinitionSummary: jest.fn(),
  restClient: undefined,
  getList: jest.fn().mockResolvedValue([
    {
      prisonNumber: 'N9980PJ',
      firstName: 'Roger',
      lastName: 'Rogerson',
      date: '2023-01-31',
      time: '03:01',
      from: 'Cardiff',
      to: 'Kirkham',
      direction: 'In',
      type: 'Admission',
      reason: 'Unconvicted Remand',
    },
  ]),
  getCount: jest.fn().mockResolvedValue(789),
  getAsyncInteractiveCount: jest.fn().mockResolvedValue(789),
  getDefinitions: jest.fn().mockResolvedValue([
    {
      id: 'external-movements',
      name: 'External movements',
      variants: [
        {
          id: 'list',
          name: 'List',
        },
      ],
    },
  ]),
  getDefinition: jest.fn().mockResolvedValue({
    id: 'external-movements',
    name: 'External movements',
    variant: {
      id: 'list',
      name: 'List',
      resourceName: '/resource/location',
      specification: {
        template: 'list',
        fields: [
          {
            name: 'prisonNumber',
            display: 'Prison Number',
            sortable: true,
            defaultsort: true,
            type: 'string',
            visible: true,
          },
          {
            name: 'firstName',
            display: 'First Name',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'lastName',
            display: 'Last Name',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'date',
            display: 'Date',
            sortable: true,
            defaultsort: false,
            type: 'date',
            visible: true,
          },
          {
            name: 'time',
            display: 'Time',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'from',
            display: 'From',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'to',
            display: 'To',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'direction',
            display: 'Direction',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
            filter: {
              type: 'Radio',
              staticOptions: [
                { name: 'in', displayName: 'In' },
                { name: 'out', displayName: 'Out' },
              ],
            },
          },
          {
            name: 'type',
            display: 'Type',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
          {
            name: 'reason',
            display: 'Reason',
            sortable: true,
            defaultsort: false,
            type: 'string',
            visible: true,
          },
        ],
      },
    },
  }),
  requestAsyncReport: jest.fn(),
  getAsyncReport: jest.fn(),
  getAsyncReportStatus: jest.fn(),
  getAsyncCount: jest.fn(),
  cancelAsyncRequest: jest.fn(),
  getAsyncSummaryReport: jest.fn(),
  logInfo: jest.fn(),
}

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
    reportingService: services.reportingService ?? new ReportingService(reportingClient),
    requestedReportService: services.requestedReportService ?? requestedReportService,
    appFeatureFlagService: services.featureFlagService ?? featureFlagService,
  } as Services

  return appSetup(servicesWithMissingMocked, production, userSupplier)
}
