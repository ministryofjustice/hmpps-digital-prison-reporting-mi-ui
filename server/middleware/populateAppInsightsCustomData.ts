import { RequestHandler } from 'express'
import RequestedReportService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/requestedReportService'

export default (requestedReportService: RequestedReportService): RequestHandler => {
  return async (req, res, next) => {
    if (res.locals.user) {
      const { username, activeCaseLoadId, uuid: userId } = res.locals.user
      const { executionId } = req.params
      const { selectedPage } = req.query
      const requestReportData = await requestedReportService.getReportByExecutionId(executionId, userId)

      if (requestReportData) {
        const { reportName, variantName } = requestReportData

        res.locals.appInsightsCustomData = {
          username,
          activeCaseLoadId,
          product: reportName,
          reportName: variantName,
          page: selectedPage ? Number(selectedPage) : null,
        }
      }
    }

    next()
  }
}
