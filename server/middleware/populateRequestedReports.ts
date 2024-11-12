import { RequestHandler } from 'express'
import { Services } from '../services'

export default (services: Services): RequestHandler => {
  return async (req, res, next) => {
    if (res.locals.user) {
      const { uuid: userId } = res.locals.user
      res.locals.requestedReports = await services.requestedReportService.getAllReports(userId)
      res.locals.recentlyViewedReports = await services.recentlyViewedService.getAllReports(userId)
    }
    next()
  }
}
