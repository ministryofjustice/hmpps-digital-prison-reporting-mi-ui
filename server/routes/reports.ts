import type { NextFunction, RequestHandler, Router } from 'express'
import createError from 'http-errors'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import urlHelper from '../utils/urlHelper'
import DataTableUtils from '../components/data-table/utils'
import { ReportQuery } from '../types/reports/class'
import FilterUtils from '../components/filters/utils'
import type { DataTableOptions } from '../components/data-table/types'
import type { FilterOptions } from '../components/filters/types'
import { components } from '../types/api'

const filtersQueryParamPrefix = 'filters.'

export default function routes(router: Router, services: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const getReportDefinition = (
    definitions: Array<components['schemas']['ReportDefinition']>,
    reportName: string,
    next: NextFunction,
  ): components['schemas']['ReportDefinition'] => {
    const reportDefinition = definitions.find((d: components['schemas']['ReportDefinition']) => d.id === reportName)

    if (reportDefinition) {
      return reportDefinition
    }

    next(createError(404, 'Not found'))
    return null
  }

  const getVariantDefinition = (
    reportDefinition: components['schemas']['ReportDefinition'],
    variantName: string,
    next: NextFunction,
  ): components['schemas']['VariantDefinition'] => {
    const variantDefinition = reportDefinition.variants.find(
      (d: components['schemas']['VariantDefinition']) => d.id === variantName,
    )

    if (variantDefinition) {
      return variantDefinition
    }

    next(createError(404, 'Not found'))
    return null
  }

  function getDefaultSortColumn(variantDefinition: components['schemas']['VariantDefinition']) {
    const defaultSortColumn = variantDefinition.fields.find(f => f.defaultSortColumn)
    return defaultSortColumn ? defaultSortColumn.name : variantDefinition.fields[0].name
  }

  get('/reports/:report/:variant', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report, next)
    const variantDefinition = getVariantDefinition(reportDefinition, req.params.variant, next)

    const reportQuery = new ReportQuery(req.query, getDefaultSortColumn(variantDefinition), filtersQueryParamPrefix)

    Promise.all([
      services.reportingService.getList(variantDefinition.resourceName, res.locals.user.token, reportQuery),
      services.reportingService.getCount(variantDefinition.resourceName, res.locals.user.token, reportQuery.filters),
    ])
      .then(data => {
        const createUrlForParameters = urlHelper.getCreateUrlForParametersFunction(reportQuery, filtersQueryParamPrefix)

        const dataTableOptions: DataTableOptions = {
          listRequest: reportQuery,
          head: DataTableUtils.mapHeader(variantDefinition.fields, reportQuery, createUrlForParameters),
          rows: DataTableUtils.mapData(data[0], variantDefinition.fields),
          count: data[1],
          createUrlForParameters,
        }

        const filterOptions: FilterOptions = {
          filters: FilterUtils.getFilters(variantDefinition.fields, reportQuery.filters),
          selectedFilters: FilterUtils.getSelectedFilters(
            variantDefinition.fields,
            reportQuery.filters,
            createUrlForParameters,
            filtersQueryParamPrefix,
          ),
        }

        res.render('pages/report', {
          title: variantDefinition.name,
          dataTableOptions,
          filterOptions,
        })
      })
      .catch(err => next(err))
  })
}
