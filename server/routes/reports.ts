import type { RequestHandler, Router } from 'express'
import createError, { NotFound } from 'http-errors'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { getDefinitionsPath } from '../utils/utils'
import { USER_MESSAGE_PREFIX } from '../errorHandler'
import {
  reportViewsCounter,
  reportLoadTimeHistogram,
  reportViewsByEstablishmentCounter,
} from '../monitoring/customMetrics'

export default function routes(router: Router, services: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const getReportDefinition = (
    definitions: Array<components['schemas']['ReportDefinitionSummary']>,
    reportName: string,
  ): components['schemas']['ReportDefinitionSummary'] | null => {
    const reportDefinition = definitions.find(
      (d: components['schemas']['ReportDefinitionSummary']) => d.id === reportName,
    )

    if (reportDefinition) {
      return reportDefinition
    }

    return null
  }

  get('/reports/:report/:variant', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report)
    const startTime = Date.now()

    if (!reportDefinition) {
      next(NotFound(`${USER_MESSAGE_PREFIX}Unrecognised report ID "${req.params.report}"`))
    } else if (!reportDefinition.variants.find(v => v.id === req.params.variant)) {
      next(NotFound(`${USER_MESSAGE_PREFIX}Unrecognised variant ID "${req.params.variant}"`))
    } else {
      const { token } = res.locals.user
      const { activeCaseLoadId } = res.locals.user || {}

      services.reportingService
        .getDefinition(token, req.params.report, req.params.variant, getDefinitionsPath(req.query) || undefined)
        .then((fullDefinition: components['schemas']['SingleVariantReportDefinition']) => {
          const { resourceName } = fullDefinition.variant
          const template = fullDefinition.variant.specification?.template

          // Record report view metrics
          reportViewsCounter.labels(req.params.report, req.params.variant, template || 'unknown').inc()

          // Record view by establishment if available
          if (activeCaseLoadId) {
            reportViewsByEstablishmentCounter.labels(activeCaseLoadId, req.params.report).inc()
          }

          switch (template) {
            case 'list':
              ReportListUtils.renderListWithData({
                title: fullDefinition.variant.name,
                variantDefinition: fullDefinition.variant,
                reportName: fullDefinition.name,
                request: req,
                response: res,
                next,
                getListDataSources: reportQuery => ({
                  data: services.reportingService.getList(resourceName, token, reportQuery),
                  count: services.reportingService.getCount(resourceName, token, reportQuery),
                }),
                layoutTemplate: 'partials/layout.njk',
                otherOptions: {
                  onRenderComplete: () => {
                    // Record load time when render completes
                    const loadTimeSeconds = (Date.now() - startTime) / 1000
                    reportLoadTimeHistogram.labels(req.params.report, req.params.variant).observe(loadTimeSeconds)
                  },
                },
              })
              break

            default:
              next(createError(500, `Unrecognised template: ${template}`))
          }
        })
    }
  })
}
