import Dict = NodeJS.Dict

export interface ListRequest {
  selectedPage: number
  pageSize: number
  sortColumn?: string
  sortedAsc: boolean
}

export interface FilteredListRequest extends ListRequest {
  filters: Dict<string>
}

export interface FieldDefinition {
  name: string
  displayName: string
  wordWrap?: 'None'
  filter?: FilterDefinition
  sortable: boolean
  defaultSortColumn: boolean
  type: 'String' | 'Date' | 'Long'
}

export interface FilterDefinition {
  type: 'Radio' | 'Select' | 'DateRange'
  staticOptions?: FilterOption[]
  defaultValue?: string
}

export interface FilterOption {
  name: string
  displayName: string
}
