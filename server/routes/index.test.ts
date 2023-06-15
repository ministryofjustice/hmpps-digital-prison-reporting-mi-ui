import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import ReportingService from '../services/reportingService'
import ReportingClient from '../data/reportingClient'

let app: Express

beforeEach(() => {
  const reportingClient: jest.Mocked<ReportingClient> = {
    getExternalMovementsCount: jest.fn().mockResolvedValue(789),
    getEstablishmentsCount: jest.fn().mockResolvedValue(123),
  }

  app = appWithAllRoutes({
    services: {
      reportingService: new ReportingService(reportingClient),
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Home')
      })
  })
})

describe('GET /reports', () => {
  it('should render reports page', () => {
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reports')
        expect(res.text).toContain('789')
        expect(res.text).toContain('123')
      })
  })
})
