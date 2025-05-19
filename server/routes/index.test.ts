import type { Express } from 'express'
import request from 'supertest'
import BookmarklistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/bookmarks/utils'
import UserReportsListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/utils'
import CatalogueUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/_catalogue/catalogue/utils'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

UserReportsListUtils.renderList = jest.fn()
BookmarklistUtils.renderBookmarkList = jest.fn()
CatalogueUtils.init = jest.fn()
UserReportsListUtils.init = jest.fn()

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Digital Prison Reporting')
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
