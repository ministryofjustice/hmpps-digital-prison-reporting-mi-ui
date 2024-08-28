import type { Express } from 'express'
import request from 'supertest'
import AsyncReportslistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/async-request-list/utils'
import RecentlyViewedCardGroupUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/recently-viewed-list/utils'
import BookmarklistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/bookmarkListUtils'
import ReportslistUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/reports-list/utils'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

AsyncReportslistUtils.renderList = jest.fn()
RecentlyViewedCardGroupUtils.renderRecentlyViewedList = jest.fn()
BookmarklistUtils.renderBookmarkList = jest.fn()
ReportslistUtils.mapReportsList = jest.fn()

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
