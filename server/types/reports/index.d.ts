import Dict = NodeJS.Dict
import type { FilterDefinition } from '../../components/filters/types'
import { FieldFormat, WordWrap } from './enum'

export interface ReportConfig {
  title: string
  resourceName: string
  format: Array<FieldDefinition>
  defaultSortColumn: string
  apiFieldNameOverrides?: Dict<string>
}

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
  header: string
  name: string
  data?(row: Dict<string>): string
  format?: FieldFormat
  filter?: FilterDefinition
  wrap?: WordWrap
}
