import type { ParsedQs } from 'qs'
import { ListRequest } from './index'

export class ReportQuery implements ListRequest {
  selectedPage: number

  pageSize: number

  sortColumn?: string

  sortedAsc: boolean

  constructor(queryParams: ParsedQs, defaultSortColumn: string) {
    this.selectedPage = queryParams.selectedPage ? Number(queryParams.selectedPage) : 1
    this.pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : 20
    this.sortColumn = queryParams.sortColumn ? queryParams.sortColumn.toString() : defaultSortColumn
    this.sortedAsc = queryParams.sortedAsc !== 'false'
  }
}

export const toRecord = (listRequest: ListRequest) => {
  const record: Record<string, string> = {
    selectedPage: listRequest.selectedPage.toString(),
    pageSize: listRequest.pageSize.toString(),
    sortColumn: listRequest.sortColumn,
    sortedAsc: listRequest.sortedAsc.toString(),
  }
  return record
}
