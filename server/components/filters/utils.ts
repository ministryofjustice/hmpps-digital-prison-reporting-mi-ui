import type { FieldDefinition } from '../../types/reports'
import Dict = NodeJS.Dict
import { FilterType } from './enum'
import { FilterValue } from './types'

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
      .filter(f => filterValues[f.name])
      .map(f => {
        let filterValueText = filterValues[f.name]
        if (f.filter.type === FilterType.dateRange) {
          const start = filterValues[`${f.name}.start`]
          const end = filterValues[`${f.name}.end`]
          filterValueText = `${start} - ${end}`
        } else if (f.filter.options) {
          filterValueText = f.filter.options.find(o => o.value === filterValues[f.name]).text
        }

        return {
          text: `${f.header}: ${filterValueText}`,
          href: createUrlForParameters({ [`${filtersPrefix}${f.name}`]: '' }),
          classes: 'filter-summary-remove-button govuk-button--secondary',
        }
      }),
}
