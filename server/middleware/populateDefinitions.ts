import { RequestHandler } from 'express'
import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import type { ParsedQs } from 'qs'
import { getDefinitionsPath } from '../utils/utils'
import config from '../config'

const deriveDefinitionsPath = (query: ParsedQs): string | undefined => {
  const definitionsPath = getDefinitionsPath(query)
  if (definitionsPath && config.definitionPathsEnabled) {
    return definitionsPath
  }
  return undefined
}

export default (service: ReportingService): RequestHandler => {
  return (req, res, next) => {
    const definitionsPath = deriveDefinitionsPath(req.query)
    res.locals.pathSuffix = definitionsPath ? `?dataProductDefinitionsPath=${definitionsPath}` : ''

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
