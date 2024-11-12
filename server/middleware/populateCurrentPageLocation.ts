import { RequestHandler } from 'express'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'

export default (): RequestHandler => {
  return (req, res, next) => {
    const currentUrl = req.originalUrl

    res.locals.currentUrl = currentUrl
    res.locals.breadCrumbList = []

    if (currentUrl !== '/') {
      res.locals.breadCrumbList.push({ text: 'Digital Prison Reporting', href: `/${res.locals.pathSuffix}` })

      if (currentUrl.includes('reports/') || currentUrl.includes('/reports/')) {
        const asyncReportMatch = res.locals.definitions
          .flatMap((definition: components['schemas']['ReportDefinitionSummary']) =>
            definition.variants.map(variant => ({
              reportId: definition.id,
              reportName: definition.name,
              variantId: variant.id,
              variantName: variant.name,
            })),
          )
          .find((item: CurrentReport) =>
            currentUrl.startsWith(`/async-reports/${item.reportId}/${item.variantId}/request/`),
          )

        if (asyncReportMatch) {
          res.locals.breadCrumbList.push({
            text: 'Request report',
            href: `/async-reports/${asyncReportMatch.reportId}/${asyncReportMatch.variantId}/request${res.locals.pathSuffix}`,
          })

          res.locals.currentReport = {
            ...asyncReportMatch,
            selectedPage: req.query.selectedPage ? Number(req.query.selectedPage) : null,
          }
        }
      }
    }

    next()
  }
}
