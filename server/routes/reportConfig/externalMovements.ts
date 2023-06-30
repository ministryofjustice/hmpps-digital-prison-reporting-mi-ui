import type { FieldDefinition, FilterOption, ReportConfig } from '../../types/reports'
import { FieldFormat, FilterType } from '../../types/reports/enum'

const directionOptions: Array<FilterOption> = [
  {
    value: 'in',
    text: 'In',
  },
  {
    value: 'out',
    text: 'Out',
  },
]

const typeOptions: Array<FilterOption> = [
  {
    value: 'transfer',
    text: 'Transfer',
  },
  {
    value: 'admission',
    text: 'Admission',
  },
]

const dataFormat: Array<FieldDefinition> = [
  { header: 'Prison Number', name: 'prisonNumber' },
  { header: 'Date', name: 'date', format: FieldFormat.date, filter: { type: FilterType.dateRange } },
  { header: 'Time', name: 'time' },
  { header: 'From', name: 'from' },
  { header: 'To', name: 'to' },
  { header: 'Direction', name: 'direction', filter: { type: FilterType.radio, options: directionOptions } },
  { header: 'Type', name: 'type', filter: { type: FilterType.radio, options: typeOptions } },
  { header: 'Reason', name: 'reason' },
]

const externalMovements: ReportConfig = {
  title: 'External movements',
  resourceName: 'external-movements',
  format: dataFormat,
  defaultSortColumn: 'prisonNumber',
}

export default externalMovements
