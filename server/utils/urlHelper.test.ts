import UrlHelper from './urlHelper'
import { ReportQuery } from '../types/reports/class'
import Dict = NodeJS.Dict

const filtersPrefix = 'filters.'

describe('Create URL', () => {
  it('Clear all filters', () => {
    const currentQueryParams: ReportQuery = {
      selectedPage: 10,
      pageSize: 20,
      sortColumn: '30',
      sortedAsc: false,
      filters: {
        direction: 'out',
      },
    }
    const updateQueryParams: Dict<string> = null

    const url = UrlHelper.createUrlForParameters(currentQueryParams, updateQueryParams, filtersPrefix)

    expect(url).toEqual('?selectedPage=1&pageSize=20&sortColumn=30&sortedAsc=false')
  })

  it('Clear single filter', () => {
    const currentQueryParams: ReportQuery = {
      selectedPage: 10,
      pageSize: 20,
      sortColumn: '30',
      sortedAsc: false,
      filters: {
        direction: 'out',
        type: 'jaunt',
      },
    }
    const updateQueryParams: Dict<string> = {
      'filters.direction': '',
    }

    const url = UrlHelper.createUrlForParameters(currentQueryParams, updateQueryParams, filtersPrefix)

    expect(url).toEqual('?selectedPage=10&pageSize=20&sortColumn=30&sortedAsc=false&filters.type=jaunt')
  })

  it('Change page with filters', () => {
    const currentQueryParams: ReportQuery = {
      selectedPage: 10,
      pageSize: 20,
      sortColumn: '30',
      sortedAsc: false,
      filters: {
        direction: 'out',
      },
    }
    const updateQueryParams: Dict<string> = {
      selectedPage: '11',
    }

    const url = UrlHelper.createUrlForParameters(currentQueryParams, updateQueryParams, filtersPrefix)

    expect(url).toEqual('?selectedPage=11&pageSize=20&sortColumn=30&sortedAsc=false&filters.direction=out')
  })
})
