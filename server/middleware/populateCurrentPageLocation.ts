import { RequestHandler } from 'express'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import localsHelper from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/localsHelper'

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
      const { pathSuffix, dpdPathFromQuery } = localsHelper.getValues(res)
      const href = dpdPathFromQuery ? `/${pathSuffix}` : '/'

      res.locals.breadCrumbList.push({
        text: 'Digital Prison Reporting',
        href,
      })

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
            text: 'Request report',
            href: `/async-reports/${asyncReportMatch.reportId}/${asyncReportMatch.variantId}/request${res.locals.pathSuffix}`,
          })
        }
      }
    }

    next()
  }
}
