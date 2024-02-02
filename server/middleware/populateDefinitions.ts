import { RequestHandler } from 'express'
import ReportingService from '../services/reportingService'
import { getDefinitionsPath } from '../utils/utils'

export default (service: ReportingService): RequestHandler => {
  return (req, res, next) => {
    if (res.locals.user.token && service) {
      return service
        .getDefinitions(res.locals.user.token, getDefinitionsPath(req.query))
        .then(definitions => {
          res.locals.definitions = definitions
          next()
        })
        .catch(next)
    }

    return Promise.resolve().then(() => next())
  }
}
