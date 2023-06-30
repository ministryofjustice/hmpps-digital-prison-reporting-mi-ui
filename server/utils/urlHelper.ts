import querystring from 'querystring'
import Dict = NodeJS.Dict
import { ReportQuery, toRecord } from '../types/reports/class'

const createUrlForParameters = (currentQueryParams: ReportQuery, updateQueryParams: Dict<string>) => {
  let queryParams: ReportQuery

  if (updateQueryParams) {
    queryParams = {
      ...currentQueryParams,
      ...updateQueryParams,
    }
  } else {
    // TODO: Remove filters (not implemented yet).
    queryParams = {
      ...currentQueryParams,
    }
  }

  return `?${querystring.stringify(toRecord(queryParams))}`
}

export default {
  createUrlForParameters,

  getCreateUrlForParametersFunction: (currentQueryParams: ReportQuery) => {
    return (updateQueryParams: Dict<string>) => createUrlForParameters(currentQueryParams, updateQueryParams)
  },
}
