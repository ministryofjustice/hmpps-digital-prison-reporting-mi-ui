import type { Express } from 'express'
import request from 'supertest'
import AsyncReportslistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/async-reports-list/utils'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

AsyncReportslistUtils.renderList = jest.fn()

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

describe('GET /info', () => {
  it('should return app info', () => {
    return request(app)
      .get('/info')
      .expect('Content-Type', 'application/json')
      .expect(res => {
        expect(res.text).toBe('{"app":"Digital Prison Reporting","activeAgencies":["***"]}')
      })
  })
})
