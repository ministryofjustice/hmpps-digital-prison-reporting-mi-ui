import UrlHelper from './urlHelper'
import { ReportQuery } from '../types/reports/class'
import Dict = NodeJS.Dict
import { FieldDefinition } from '../types/reports'

const defaultFields: Array<FieldDefinition> = [
  {
    name: 'direction',
    displayName: 'Direction',
    sortable: true,
    defaultSortColumn: true,
    filter: {
      type: 'Radio',
    },
    type: 'String',
  },
]

const defaultQueryParams = {
  selectedPage: '10',
  pageSize: '20',
  sortColumn: '30',
  sortedAsc: 'false',
  'f.direction': 'out',
}

const defaultReportQuery: ReportQuery = new ReportQuery(defaultFields, defaultQueryParams, 'one', 'f.')

describe('Create URL', () => {
  it('Clear all filters', () => {
    const updateQueryParams: Dict<string> = null

    const url = UrlHelper.createUrlForParameters(defaultReportQuery, updateQueryParams)

    expect(url).toEqual('?selectedPage=1&pageSize=20&sortColumn=30&sortedAsc=false')
  })

  it('Clear single filter', () => {
    const currentQueryParams: ReportQuery = new ReportQuery(
      defaultFields,
      {
        ...defaultQueryParams,
        'f.type': 'jaunt',
      },
      'one',
      'f.',
    )
    const updateQueryParams: Dict<string> = {
      'f.direction': '',
    }

    const url = UrlHelper.createUrlForParameters(currentQueryParams, updateQueryParams)

    expect(url).toEqual('?selectedPage=10&pageSize=20&sortColumn=30&sortedAsc=false&f.type=jaunt')
  })

  it('Change page with filters', () => {
    const updateQueryParams: Dict<string> = {
      selectedPage: '11',
    }

    const url = UrlHelper.createUrlForParameters(defaultReportQuery, updateQueryParams)

    expect(url).toEqual('?selectedPage=11&pageSize=20&sortColumn=30&sortedAsc=false&f.direction=out')
  })
})
