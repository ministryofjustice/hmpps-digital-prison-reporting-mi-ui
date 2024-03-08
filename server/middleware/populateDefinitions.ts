import { RequestHandler } from 'express'
import ReportingService from '../services/reportingService'
import { getDefinitionsPath } from '../utils/utils'
import config from '../config'

export default (service: ReportingService): RequestHandler => {
  return (req, res, next) => {
    let definitionsPath = getDefinitionsPath(req.query)
    res.locals.pathSuffix = ''

    if (definitionsPath && !config.definitionPathsEnabled) {
      req.query.dataProductDefinitionsPath = null
      definitionsPath = null
    } else if (definitionsPath) {
      res.locals.pathSuffix = `?dataProductDefinitionsPath=${definitionsPath}`
    }

    if (res.locals.user.token && service) {
      return service
        .getDefinitions(res.locals.user.token, definitionsPath)
        .then(definitions => {
          res.locals.definitions = definitions
          next()
        })
        .catch(next)
    }

    return Promise.resolve().then(() => next())
  }
}
