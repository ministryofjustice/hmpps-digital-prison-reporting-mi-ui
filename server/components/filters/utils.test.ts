import Utils from './utils'
import Dict = NodeJS.Dict
import { FilterType } from './enum'
import { DateRange } from './types'
import { components } from '../../types/api'

const options = [
  {
    name: '1',
    displayName: 'One',
  },
  {
    name: '2',
    displayName: 'Two',
  },
]

const selectFieldFormat: Array<components['schemas']['FieldDefinition']> = [
  {
    displayName: 'Select Field',
    name: 'selectField',
    filter: {
      type: FilterType.select,
      staticOptions: options,
    },
    sortable: true,
    defaultSortColumn: false,
    type: 'string',
  },
]

const radioFieldFormat: Array<components['schemas']['FieldDefinition']> = [
  {
    displayName: 'Radio Field',
    name: 'radioField',
    filter: {
      type: FilterType.radio,
      staticOptions: options,
    },
    sortable: true,
    defaultSortColumn: false,
    type: 'string',
  },
]

const dateRangeFieldFormat: Array<components['schemas']['FieldDefinition']> = [
  {
    displayName: 'Date Range Field',
    name: 'dateRangeField',
    filter: {
      type: FilterType.dateRange,
    },
    sortable: true,
    defaultSortColumn: false,
    type: 'string',
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
    expect(result[0].options[0].value).toEqual(selectFieldFormat[0].filter.staticOptions[0].name)
    expect(result[0].options[0].text).toEqual(selectFieldFormat[0].filter.staticOptions[0].displayName)
    expect(result[0].options[1].value).toEqual(selectFieldFormat[0].filter.staticOptions[1].name)
    expect(result[0].options[1].text).toEqual(selectFieldFormat[0].filter.staticOptions[1].displayName)
    expect(result[0].value).toEqual(selectFieldFormat[0].filter.staticOptions[1].name)
  })

  it('Radio filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      radioField: '2',
    }

    const result = Utils.getFilters(radioFieldFormat, filterValues)

    expect(result.length).toEqual(1)
    expect(result[0].name).toEqual(radioFieldFormat[0].name)
    expect(result[0].options[0].value).toEqual(selectFieldFormat[0].filter.staticOptions[0].name)
    expect(result[0].options[0].text).toEqual(selectFieldFormat[0].filter.staticOptions[0].displayName)
    expect(result[0].options[1].value).toEqual(selectFieldFormat[0].filter.staticOptions[1].name)
    expect(result[0].options[1].text).toEqual(selectFieldFormat[0].filter.staticOptions[1].displayName)
    expect(result[0].value).toEqual(radioFieldFormat[0].filter.staticOptions[1].name)
  })

  it('Date range filter mapped correctly', () => {
    const filterValues: Dict<string> = {
      'dateRangeField.start': '2001-02-03',
      'dateRangeField.end': '2004-05-06',
    }

    const result = Utils.getFilters(dateRangeFieldFormat, filterValues)

    expect(result.length).toEqual(1)
    expect(result[0].name).toEqual(dateRangeFieldFormat[0].name)
    expect(result[0].options).toBeFalsy()
    expect(result[0].value).toBeTruthy()

    expect(<DateRange>result[0].value).toBeTruthy()
    expect((<DateRange>result[0].value).start).toEqual('2001-02-03')
    expect((<DateRange>result[0].value).end).toEqual('2004-05-06')
  })

  it('No filter mapped correctly', () => {
    const format: Array<components['schemas']['FieldDefinition']> = [
      {
        displayName: 'No Filter Field',
        name: 'noFilterField',
        sortable: true,
        defaultSortColumn: false,
        type: 'string',
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
})
