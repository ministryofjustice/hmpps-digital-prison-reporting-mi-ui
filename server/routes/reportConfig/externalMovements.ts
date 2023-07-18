import type { FieldDefinition, ReportConfig } from '../../types/reports'
import type { FilterOption } from '../../components/filters/types'
import { FieldFormat } from '../../types/reports/enum'
import { FilterType } from '../../components/filters/enum'

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

const dataFormat: Array<FieldDefinition> = [
  { header: 'Prison Number', name: 'prisonNumber' },
  { header: 'Date', name: 'date', format: FieldFormat.date, filter: { type: FilterType.dateRange } },
  { header: 'Time', name: 'time' },
  { header: 'From', name: 'from' },
  { header: 'To', name: 'to' },
  { header: 'Direction', name: 'direction', filter: { type: FilterType.radio, options: directionOptions } },
  { header: 'Type', name: 'type' },
  { header: 'Reason', name: 'reason' },
]

const externalMovements: ReportConfig = {
  title: 'External movements',
  resourceName: 'external-movements',
  format: dataFormat,
  defaultSortColumn: 'prisonNumber',
  apiFieldNameOverrides: {
    'date.start': 'startDate',
    'date.end': 'endDate',
  },
}

export default externalMovements
