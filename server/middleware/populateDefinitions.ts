import { RequestHandler } from 'express'
import ReportingService from '../services/reportingService'

export default (service: ReportingService): RequestHandler => {
  return (req, res, next) => {
    if (res.locals.user.token && service) {
      return service
        .getDefinitions(res.locals.user.token)
        .then(definitions => {
          res.locals.definitions = definitions
          next()
        })
        .catch(next)
    }

    return Promise.resolve().then(() => next())
  }
}
