import { RequestHandler } from 'express'
import type { dprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/createDprServices'

export default (service: dprServices['reportingService']): RequestHandler => {
  return (_req, res, next) => {
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
