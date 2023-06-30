import Dict = NodeJS.Dict

export interface ReportConfig {
  title: string
  resourceName: string
  format: Array<FieldDefinition>
  defaultSortColumn: string
}

export interface ListRequest {
  selectedPage: number
  pageSize: number
  sortColumn?: string
  sortedAsc: boolean
}

export interface Header {
  html: string
  format?: string
}

export interface Cell {
  text: string
  format?: string
}

export interface DataTableOptions {
  listRequest: ListRequest
  head: Array<Header>
  rows: Array<Array<Cell>>
  count: number
  createUrlForParameters(updateQueryParams: Dict<string>): string
}

export interface FieldDefinition {
  header: string
  name: string
  data?(row: Dict<string>): string
  format?: FieldFormat
  filter?: FilterDefinition
}

export interface FilterDefinition {
  type: FilterType
  options?: Array<FilterOption>
}

export interface FilterOption {
  value: string
  text: string
}
