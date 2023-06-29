import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import ReportingService from '../services/reportingService'
import ReportingClient from '../data/reportingClient'

let app: Express

beforeEach(() => {
  const reportingClient: jest.Mocked<ReportingClient> = {
    getList: jest.fn().mockResolvedValue({}),
    getCount: jest.fn().mockResolvedValue(789),
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

describe('GET /reports', () => {
  it('should render reports page', () => {
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reports')
        expect(res.text).toContain('External movements')
      })
  })
})

describe('GET /reports/external-movements', () => {
  it('should render External Movements report', () => {
    return request(app)
      .get('/reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('External movements')
      })
  })
})
