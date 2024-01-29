import type { NextFunction, RequestHandler, Router } from 'express'
import createError from 'http-errors'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import CardUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/card-group/utils'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'

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
      cards: CardUtils.variantDefinitionsToCards(
        reportDefinition,
        '/reports',
        ReportListUtils.filtersQueryParameterPrefix,
      ),
    })
  })

  get('/reports/:report/:variant', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report, next)
    const variantDefinition = getVariantDefinition(reportDefinition, req.params.variant, next)

    const { resourceName, specification } = variantDefinition
    const { token } = res.locals.user

    switch (specification.template) {
      case 'list': {
        const { name: title, classification, printable } = variantDefinition
        ReportListUtils.renderListWithData({
          title,
          fields: specification.fields,
          classification,
          printable,
          request: req,
          response: res,
          next,
          getListDataSources: reportQuery => ({
            data: services.reportingService.getList(resourceName, token, reportQuery),
            count: services.reportingService.getCount(resourceName, token, reportQuery),
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
      }
      default:
        next()
    }
  })
}
