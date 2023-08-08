import { ListRequest } from '../../types/reports'
import Dict = NodeJS.Dict

export interface Header {
  html: string
  format?: string
}

export interface Cell {
  text: string
  format?: string
  classes?: string
}

export interface DataTableOptions {
  listRequest: ListRequest
  head: Array<Header>
  rows: Array<Array<Cell>>
  count: number
  createUrlForParameters(updateQueryParams: Dict<string>): string
}
