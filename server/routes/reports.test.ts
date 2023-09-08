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
                  displayName: 'Prison Number',
                  sortable: true,
                  defaultSortColumn: true,
                  type: 'String',
                },
                {
                  name: 'firstName',
                  displayName: 'First Name',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'lastName',
                  displayName: 'Last Name',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'date',
                  displayName: 'Date',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'Date',
                },
                {
                  name: 'time',
                  displayName: 'Time',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'from',
                  displayName: 'From',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'to',
                  displayName: 'To',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'direction',
                  displayName: 'Direction',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
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
                  displayName: 'Type',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
                },
                {
                  name: 'reason',
                  displayName: 'Reason',
                  sortable: true,
                  defaultSortColumn: false,
                  type: 'String',
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
