import type { FieldDefinition } from '../../types/reports'
import Dict = NodeJS.Dict
import { FilterType } from './enum'
import { FilterValue } from './types'

const LOCALE = 'en-GB'

const toLocaleDate = (isoDate?: string) => (isoDate ? new Date(isoDate).toLocaleDateString(LOCALE) : null)

export default {
  getFilters: (format: Array<FieldDefinition>, filterValues: Dict<string>) =>
    format
      .filter(f => f.filter)
      .map(f => {
        const filter: FilterValue = {
          text: f.header,
          name: f.name,
          type: f.filter.type,
          options: f.filter.options,
          value: filterValues[f.name],
        }

        if (f.filter.type === FilterType.dateRange) {
          filter.value = {
            start: filterValues[`${f.name}.start`],
            end: filterValues[`${f.name}.end`],
          }
        }

        return filter
      }),

  getSelectedFilters: (
    format: Array<FieldDefinition>,
    filterValues: Dict<string>,
    createUrlForParameters: (updateQueryParams: Dict<string>) => string,
    filtersPrefix: string,
  ) =>
    format
      .filter(f => f.filter)
      .filter(f =>
        f.filter.type === FilterType.dateRange
          ? filterValues[`${f.name}.start`] || filterValues[`${f.name}.end`]
          : filterValues[f.name],
      )
      .map(f => {
        let filterValueText = filterValues[f.name]
        if (f.filter.type === FilterType.dateRange) {
          const start = toLocaleDate(filterValues[`${f.name}.start`])
          const end = toLocaleDate(filterValues[`${f.name}.end`])

          if (start && end) {
            filterValueText = `${start} - ${end}`
          } else if (start) {
            filterValueText = `From ${start}`
          } else {
            filterValueText = `Until ${end}`
          }
        } else if (f.filter.options) {
          filterValueText = f.filter.options.find(o => o.value === filterValues[f.name]).text
        }

        return {
          text: `${f.header}: ${filterValueText}`,
          href: createUrlForParameters({
            [`${filtersPrefix}${f.name}`]: '',
            selectedPage: '1',
          }),
          classes: 'filter-summary-remove-button govuk-button--secondary',
        }
      }),
}
