import type { RequestHandler, Router } from 'express'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import reportConfigs from './reportConfig'
import urlHelper from '../utils/urlHelper'
import DataTableUtils from '../components/data-table/utils'
import { ReportQuery } from '../types/reports/class'
import FilterUtils from '../components/filters/utils'
import type { DataTableOptions } from '../components/data-table/types'
import type { FilterOptions } from '../components/filters/types'

const filtersQueryParamPrefix = 'filters.'

export default function routes(router: Router, services: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/reports/:report', (req, res, next) => {
    const reportConfig = reportConfigs[req.params.report]
    const reportQuery = new ReportQuery(req.query, reportConfig.defaultSortColumn, filtersQueryParamPrefix)

    Promise.all([
      services.reportingService.getList(
        reportConfig.resourceName,
        res.locals.user.token,
        reportQuery,
        reportConfig.apiFieldNameOverrides,
      ),
      services.reportingService.getCount(
        reportConfig.resourceName,
        res.locals.user.token,
        reportQuery.filters,
        reportConfig.apiFieldNameOverrides,
      ),
    ])
      .then(data => {
        const createUrlForParameters = urlHelper.getCreateUrlForParametersFunction(reportQuery, filtersQueryParamPrefix)

        const dataTableOptions: DataTableOptions = {
          listRequest: reportQuery,
          head: DataTableUtils.mapHeader(reportConfig.format, reportQuery, createUrlForParameters),
          rows: DataTableUtils.mapData(data[0], reportConfig.format),
          count: data[1],
          createUrlForParameters,
        }

        const filterOptions: FilterOptions = {
          filters: FilterUtils.getFilters(reportConfig.format, reportQuery.filters),
          selectedFilters: FilterUtils.getSelectedFilters(
            reportConfig.format,
            reportQuery.filters,
            createUrlForParameters,
            filtersQueryParamPrefix,
          ),
        }

        res.render('pages/report', {
          title: reportConfig.title,
          dataTableOptions,
          filterOptions,
        })
      })
      .catch(err => next(err))
  })
}
