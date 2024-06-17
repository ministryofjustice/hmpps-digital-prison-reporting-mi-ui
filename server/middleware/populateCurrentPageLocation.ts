import { RequestHandler } from 'express'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'

export default (): RequestHandler => {
  return (req, res, next) => {
    const currentUrl = req.originalUrl

    res.locals.currentUrl = currentUrl
    res.locals.breadCrumbList = []

    if (currentUrl !== '/') {
      res.locals.breadCrumbList.push({ text: 'Home', href: `/${res.locals.pathSuffix}` })

      if (currentUrl.includes('reports/') || currentUrl.includes('/reports/')) {
        res.locals.breadCrumbList.push({ text: 'Reports', href: `/reports${res.locals.pathSuffix}` })

        res.locals.definitions
          .filter((definition: components['schemas']['ReportDefinitionSummary']) =>
            currentUrl.includes(`/${definition.id}/`),
          )
          .forEach((definition: components['schemas']['ReportDefinitionSummary']) => {
            res.locals.breadCrumbList.push({
              text: definition.name,
              href: `/reports/${definition.id}${res.locals.pathSuffix}`,
            })
          })
      }
    }

    next()
  }
}
