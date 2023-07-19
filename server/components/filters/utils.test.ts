import Utils from './utils'
import { FieldDefinition } from '../../types/reports'
import Dict = NodeJS.Dict
import { FilterType } from './enum'
import { DateRange } from './types'

const options = [
  {
    value: '1',
    text: 'One',
  },
  {
    value: '2',
    text: 'Two',
  },
]

const selectFieldFormat: Array<FieldDefinition> = [
  {
    header: 'Select Field',
    name: 'selectField',
    filter: {
      type: FilterType.select,
      options,
    },
  },
]

const radioFieldFormat: Array<FieldDefinition> = [
  {
    header: 'Radio Field',
    name: 'radioField',
    filter: {
      type: FilterType.select,
      options,
    },
  },
]

const dateRangeFieldFormat: Array<FieldDefinition> = [
  {
    header: 'Date Range Field',
    name: 'dateRangeField',
    filter: {
      type: FilterType.dateRange,
    },
  },
]

describe('getFilters', () => {
  it('Select filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      selectField: '2',
    }

    const result = Utils.getFilters(selectFieldFormat, filterValues)

    expect(result.length).toEqual(1)
    expect(result[0].name).toEqual(selectFieldFormat[0].name)
    expect(result[0].options).toEqual(selectFieldFormat[0].filter.options)
    expect(result[0].value).toEqual(selectFieldFormat[0].filter.options[1].value)
  })

  it('Radio filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      radioField: '2',
    }

    const result = Utils.getFilters(radioFieldFormat, filterValues)

    expect(result.length).toEqual(1)
    expect(result[0].name).toEqual(radioFieldFormat[0].name)
    expect(result[0].options).toEqual(radioFieldFormat[0].filter.options)
    expect(result[0].value).toEqual(radioFieldFormat[0].filter.options[1].value)
  })

  it('Date range filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      'dateRangeField.start': '2001-02-03',
      'dateRangeField.end': '2004-05-06',
    }

    const result = Utils.getFilters(dateRangeFieldFormat, filterValues)

    expect(result.length).toEqual(1)
    expect(result[0].name).toEqual(dateRangeFieldFormat[0].name)
    expect(result[0].options).toBeUndefined()
    expect(result[0].value).toBeTruthy()

    expect(<DateRange>result[0].value).toBeTruthy()
    expect((<DateRange>result[0].value).start).toEqual('2001-02-03')
    expect((<DateRange>result[0].value).end).toEqual('2004-05-06')
  })

  it('No filter mapped correctly', () => {
    const format: Array<FieldDefinition> = [
      {
        header: 'No Filter Field',
        name: 'noFilterField',
      },
    ]
    const filterValues: Dict<string> = {
      selectField: '2',
    }

    const result = Utils.getFilters(format, filterValues)

    expect(result.length).toEqual(0)
  })
})

const createUrlForParameters = (updateQueryParams: Dict<string>) => JSON.stringify(updateQueryParams)

describe('getSelectedFilters', () => {
  it('Select filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      selectField: '2',
    }

    const result = Utils.getSelectedFilters(selectFieldFormat, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(1)
    expect(result[0].text).toEqual('Select Field: Two')
    expect(result[0].href).toEqual('{"selectField":"","selectedPage":"1"}')
  })

  it('Radio filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      radioField: '2',
    }

    const result = Utils.getSelectedFilters(radioFieldFormat, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(1)
    expect(result[0].text).toEqual('Radio Field: Two')
    expect(result[0].href).toEqual('{"radioField":"","selectedPage":"1"}')
  })

  it('Date range filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      'dateRangeField.start': '2001-02-03',
      'dateRangeField.end': '2004-05-06',
    }

    const result = Utils.getSelectedFilters(dateRangeFieldFormat, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(1)
    expect(result[0].text).toEqual('Date Range Field: 03/02/2001 - 06/05/2004')
    expect(result[0].href).toEqual('{"dateRangeField":"","selectedPage":"1"}')
  })

  it('Date range filter with just start date mapped correctly', () => {
    const filterValues: Dict<string> = {
      'dateRangeField.start': '2001-02-03',
    }

    const result = Utils.getSelectedFilters(dateRangeFieldFormat, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(1)
    expect(result[0].text).toEqual('Date Range Field: From 03/02/2001')
    expect(result[0].href).toEqual('{"dateRangeField":"","selectedPage":"1"}')
  })

  it('Date range filter with just end date mapped correctly', () => {
    const filterValues: Dict<string> = {
      'dateRangeField.end': '2004-05-06',
    }

    const result = Utils.getSelectedFilters(dateRangeFieldFormat, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(1)
    expect(result[0].text).toEqual('Date Range Field: Until 06/05/2004')
    expect(result[0].href).toEqual('{"dateRangeField":"","selectedPage":"1"}')
  })

  it('No filter mapped correctly', () => {
    const format: Array<FieldDefinition> = [
      {
        header: 'No Filter Field',
        name: 'noFilterField',
      },
    ]
    const filterValues: Dict<string> = {
      selectField: '2',
    }

    const result = Utils.getSelectedFilters(format, filterValues, createUrlForParameters, '')

    expect(result.length).toEqual(0)
  })
})
