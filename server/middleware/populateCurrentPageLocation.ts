import { RequestHandler } from 'express'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'

interface ReportMatch {
  reportId: string
  variantId: string
}

export default (): RequestHandler => {
  return (req, res, next) => {
    const currentUrl = req.originalUrl

    res.locals.currentUrl = currentUrl
    res.locals.breadCrumbList = []

    if (currentUrl !== '/') {
      res.locals.breadCrumbList.push({ text: 'Home', href: `/${res.locals.pathSuffix}` })

      if (currentUrl.includes('reports/') || currentUrl.includes('/reports/')) {
        const asyncReportMatch = res.locals.definitions
          .flatMap((definition: components['schemas']['ReportDefinitionSummary']) =>
            definition.variants.map(variant => ({
              reportId: definition.id,
              variantId: variant.id,
            })),
          )
          .find((item: ReportMatch) =>
            currentUrl.startsWith(`/async-reports/${item.reportId}/${item.variantId}/request/`),
          )

        if (asyncReportMatch) {
          res.locals.breadCrumbList.push({
            text: 'Request Report',
            href: `/async-reports/${asyncReportMatch.reportId}/${asyncReportMatch.variantId}/request${res.locals.pathSuffix}`,
          })
        }
      }
    }

    next()
  }
}
