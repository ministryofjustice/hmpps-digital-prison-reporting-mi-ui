import querystring from 'querystring'
import Dict = NodeJS.Dict
import { ReportQuery, toRecord } from '../types/reports/class'

const createUrlForParameters = (currentQueryParams: ReportQuery, updateQueryParams: Dict<string>) => {
  let queryParams: Dict<string> = toRecord(currentQueryParams)

  if (updateQueryParams) {
    Object.keys(updateQueryParams).forEach(q => {
      if (updateQueryParams[q]) {
        queryParams[q] = updateQueryParams[q]
      } else {
        Object.keys(queryParams)
          .filter(key => key === q || key.startsWith(`${q}.`))
          .forEach(key => {
            queryParams[key] = null
          })
      }
    })
  } else {
    queryParams = toRecord({
      ...currentQueryParams,
      filters: null,
    })
  }

  const nonEmptyQueryParams = {}

  Object.keys(queryParams)
    .filter(key => queryParams[key])
    .forEach(key => {
      nonEmptyQueryParams[key] = queryParams[key]
    })

  return `?${querystring.stringify(nonEmptyQueryParams)}`
}

export default {
  createUrlForParameters,

  getCreateUrlForParametersFunction: (currentQueryParams: ReportQuery) => {
    return (updateQueryParams: Dict<string>) => createUrlForParameters(currentQueryParams, updateQueryParams)
  },
}
