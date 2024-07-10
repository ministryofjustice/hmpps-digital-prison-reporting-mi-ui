import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

describe('GET /reports/external-movements/list', () => {
  it('should render External Movements report', () => {
    return request(app)
      .get('/reports/external-movements/list')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('List')
        expect(res.text).toContain('N9980PJ')
        expect(res.text).toContain('31/01/23')
      })
  })

  it('should render correct paging URL when filtered', () => {
    return request(app)
      .get('/reports/external-movements/list?filters.direction=in')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('?filters.direction=in&amp;selectedPage=2')
      })
  })

  it('should render correct sorting URL when filtered', () => {
    return request(app)
      .get('/reports/external-movements/list?filters.direction=in')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          '?selectedPage=1&pageSize=20&sortColumn=prisonNumber&sortedAsc=false&columns=prisonNumber&columns=firstName&columns=lastName&columns=date&columns=time&columns=from&columns=to&columns=direction&columns=type&columns=reason&filters.direction=in',
        )
      })
  })

  it('should render correct remove filter URL when filtered', () => {
    return request(app)
      .get('/reports/external-movements/list?filters.direction=in&filters.type=jaunt')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          '?selectedPage=1&amp;pageSize=20&amp;sortColumn=prisonNumber&amp;sortedAsc=true&amp;columns=prisonNumber&amp;columns=firstName&amp;columns=lastName&amp;columns=date&amp;columns=time&amp;columns=from&amp;columns=to&amp;columns=direction&amp;columns=type&amp;columns=reason&amp;filters.direction=~clear~&amp;filters.type=jaunt"',
        )
      })
  })
})
