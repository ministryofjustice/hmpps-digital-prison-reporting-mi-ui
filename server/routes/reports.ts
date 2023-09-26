import type { NextFunction, RequestHandler, Router } from 'express'
import createError from 'http-errors'
import querystring from 'querystring'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { components } from '../types/api'
import ReportListUtils from '../components/report-list/utils'

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

  get('/reports/:report', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report, next)

    res.render('pages/card', {
      title: reportDefinition.name,
      breadCrumbList: [{ text: 'Reports', href: '/reports' }],
      cards: reportDefinition.variants.map((v: components['schemas']['VariantDefinition']) => {
        const defaultFilters: Record<string, string> = {}

        v.specification.fields
          .filter(f => f.filter && f.filter.defaultValue)
          .forEach(f => {
            if (f.filter.type === 'DateRange') {
              const dates = f.filter.defaultValue.split(' - ')

              if (dates.length >= 1) {
                // eslint-disable-next-line prefer-destructuring
                defaultFilters[`${ReportListUtils.filtersQueryParameterPrefix}${f.name}.start`] = dates[0]

                if (dates.length >= 2) {
                  // eslint-disable-next-line prefer-destructuring
                  defaultFilters[`${ReportListUtils.filtersQueryParameterPrefix}${f.name}.end`] = dates[1]
                }
              }
            } else {
              defaultFilters[`${ReportListUtils.filtersQueryParameterPrefix}${f.name}`] = f.filter.defaultValue
            }
          })

        return {
          text: v.name,
          href: `/reports/${reportDefinition.id}/${v.id}?${querystring.stringify(defaultFilters)}`,
          description: v.description,
        }
      }),
    })
  })

  get('/reports/:report/:variant', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report, next)
    const variantDefinition = getVariantDefinition(reportDefinition, req.params.variant, next)

    const { resourceName } = variantDefinition
    const { token } = res.locals.user

    switch (variantDefinition.specification.template) {
      case 'list':
        ReportListUtils.renderList({
          title: variantDefinition.name,
          fields: variantDefinition.specification.fields,
          request: req,
          response: res,
          next,
          getListDataSources: reportQuery => ({
            data: services.reportingService.getList(resourceName, token, reportQuery),
            count: services.reportingService.getCount(resourceName, token, reportQuery.filters),
          }),
          otherOptions: {
            breadCrumbList: [
              { text: 'Reports', href: '/reports' },
              { text: reportDefinition.name, href: `/reports/${reportDefinition.id}` },
            ],
          },
          layoutTemplate: 'partials/layout.njk',
        })
        break

      default:
        next()
    }
  })
}
