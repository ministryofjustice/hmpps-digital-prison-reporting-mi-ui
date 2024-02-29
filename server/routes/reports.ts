import type { RequestHandler, Router } from 'express'
import { NotFound } from 'http-errors'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import CardUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/card-group/utils'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { getDefinitionsParameters, getDefinitionsPath } from '../utils/utils'
import { USER_MESSAGE_PREFIX } from '../errorHandler'

export default function routes(router: Router, services: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const getReportDefinition = (
    definitions: Array<components['schemas']['ReportDefinitionSummary']>,
    reportName: string,
  ): components['schemas']['ReportDefinitionSummary'] => {
    const reportDefinition = definitions.find(
      (d: components['schemas']['ReportDefinitionSummary']) => d.id === reportName,
    )

    if (reportDefinition) {
      return reportDefinition
    }

    return null
  }

  get('/reports/:report', (req, res, next) => {
    const reportDefinition = getReportDefinition(res.locals.definitions, req.params.report)

    if (!reportDefinition) {
      next(NotFound(`${USER_MESSAGE_PREFIX}Unrecognised report ID "${req.params.report}"`))
    } else {
      res.render('pages/card', {
        title: reportDefinition.name,
        breadCrumbList: [{ text: 'Reports', href: '/reports' }],
        cards: {
          items: CardUtils.variantDefinitionsToCards(reportDefinition, '/reports', getDefinitionsParameters(req.query)),
          variant: 1,
        },
      })
    }
  })

  get('/reports/:report/:variant', (req, res, next) => {
    const { token } = res.locals.user
    services.reportingService
      .getDefinition(token, req.params.report, req.params.variant, getDefinitionsPath(req.query))
      .then(fullDefinition => {
        const { resourceName } = fullDefinition.variant

        switch (fullDefinition.variant.specification.template) {
          case 'list':
            ReportListUtils.renderListWithData({
              title: fullDefinition.variant.name,
              variantDefinition: fullDefinition.variant,
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
                  { text: fullDefinition.name, href: `/reports/${fullDefinition.id}` },
                ],
              },
              layoutTemplate: 'partials/layout.njk',
            })
            break

          default:
            next()
        }
      })
  })
}
