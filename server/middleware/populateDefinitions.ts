import { RequestHandler } from 'express'
import ReportingService from '../services/reportingService'
import { getDefinitionsPath } from '../utils/utils'
import config from '../config'

export default (service: ReportingService): RequestHandler => {
  return (req, res, next) => {
    const definitionsPath = getDefinitionsPath(req.query)

    if (definitionsPath && !config.definitionPathsEnabled) {
      req.query.dataProductDefinitionsPath = null
    }

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
