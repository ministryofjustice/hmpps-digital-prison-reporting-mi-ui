import type { ParsedQs } from 'qs'
import { FilteredListRequest } from './index'
import Dict = NodeJS.Dict

export class ReportQuery implements FilteredListRequest {
  selectedPage: number

  pageSize: number

  sortColumn?: string

  sortedAsc: boolean

  filters: Dict<string>

  constructor(queryParams: ParsedQs, defaultSortColumn: string, filtersPrefix: string) {
    this.selectedPage = queryParams.selectedPage ? Number(queryParams.selectedPage) : 1
    this.pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : 20
    this.sortColumn = queryParams.sortColumn ? queryParams.sortColumn.toString() : defaultSortColumn
    this.sortedAsc = queryParams.sortedAsc !== 'false'

    this.filters = {}
    Object.keys(queryParams)
      .filter(key => key.startsWith(filtersPrefix))
      .filter(key => queryParams[key])
      .forEach(key => {
        this.filters[key.replace(filtersPrefix, '')] = queryParams[key].toString()
      })
  }
}

export const toRecord = (listRequest: FilteredListRequest) => {
  const record: Record<string, string> = {
    selectedPage: listRequest.selectedPage.toString(),
    pageSize: listRequest.pageSize.toString(),
    sortColumn: listRequest.sortColumn,
    sortedAsc: listRequest.sortedAsc.toString(),
    ...listRequest.filters,
  }
  return record
}

export const toRecordWithFilterPrefix = (listRequest: FilteredListRequest, filtersPrefix: string) => {
  const record: Record<string, string> = {
    selectedPage: listRequest.selectedPage.toString(),
    pageSize: listRequest.pageSize.toString(),
    sortColumn: listRequest.sortColumn,
    sortedAsc: listRequest.sortedAsc.toString(),
  }

  Object.keys(listRequest.filters).forEach(filterName => {
    record[`${filtersPrefix}${filterName}`] = listRequest.filters[filterName]
  })

  return record
}
