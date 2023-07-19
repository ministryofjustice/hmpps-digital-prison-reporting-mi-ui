export interface FilterDefinition {
  type: FilterType
  options?: Array<FilterOption>
  value?: string
}

export interface FilterOption {
  value: string
  text: string
}

export interface FilterValue {
  text: string
  name: string
  type: FilterType
  value?: string | DateRange
  options?: Array<FilterOption>
}

export interface SelectedFilter {
  text: string
  href: string
  classes: string
}

export interface DateRange {
  start: string
  end: string
}

export interface FilterOptions {
  filters: Array<FilterValue>
  selectedFilters: Array<SelectedFilter>
}
