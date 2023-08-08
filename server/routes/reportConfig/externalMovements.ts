import type { FieldDefinition, ReportConfig } from '../../types/reports'
import type { FilterOption } from '../../components/filters/types'
import { FieldFormat, WordWrap } from '../../types/reports/enum'
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
  { header: 'Name', name: 'name', data: d => `${d.lastName}, ${d.firstName[0]}`, wrap: WordWrap.None },
  { header: 'Date', name: 'date', format: FieldFormat.date, filter: { type: FilterType.dateRange } },
  { header: 'Time', name: 'time' },
  { header: 'From', name: 'from', wrap: WordWrap.None },
  { header: 'To', name: 'to', wrap: WordWrap.None },
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
    name: 'lastName',
  },
}

export default externalMovements
