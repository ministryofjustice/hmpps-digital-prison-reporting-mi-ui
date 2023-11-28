import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import ReportingService from '../services/reportingService'
import ReportingClient from '../data/reportingClient'

let app: Express

beforeEach(() => {
  const reportingClient: jest.Mocked<ReportingClient> = {
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
    getDefinitions: jest.fn().mockResolvedValue([
      {
        id: 'external-movements',
        name: 'External movements',
        variants: [
          {
            id: 'list',
            name: 'List',
            specification: {
              template: 'list',
              fields: [
                {
                  name: 'prisonNumber',
                  display: 'Prison Number',
                  sortable: true,
                  defaultsort: true,
                  type: 'string',
                },
                {
                  name: 'firstName',
                  display: 'First Name',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
                {
                  name: 'lastName',
                  display: 'Last Name',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
                {
                  name: 'date',
                  display: 'Date',
                  sortable: true,
                  defaultsort: false,
                  type: 'date',
                },
                {
                  name: 'time',
                  display: 'Time',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
                {
                  name: 'from',
                  display: 'From',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
                {
                  name: 'to',
                  display: 'To',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
                {
                  name: 'direction',
                  display: 'Direction',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
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
                },
                {
                  name: 'reason',
                  display: 'Reason',
                  sortable: true,
                  defaultsort: false,
                  type: 'string',
                },
              ],
            },
          },
        ],
      },
    ]),
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
        expect(res.text).toContain(
          '?selectedPage=2&amp;pageSize=20&amp;sortColumn=prisonNumber&amp;sortedAsc=true&amp;filters.direction=in',
        )
      })
  })

  it('should render correct sorting URL when filtered', () => {
    return request(app)
      .get('/reports/external-movements/list?filters.direction=in')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          '?selectedPage=1&pageSize=20&sortColumn=prisonNumber&sortedAsc=false&filters.direction=in',
        )
      })
  })

  it('should render correct remove filter URL when filtered', () => {
    return request(app)
      .get('/reports/external-movements/list?filters.direction=in&filters.type=jaunt')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          '?selectedPage=1&amp;pageSize=20&amp;sortColumn=prisonNumber&amp;sortedAsc=true&amp;filters.type=jaunt"',
        )
      })
  })
})
