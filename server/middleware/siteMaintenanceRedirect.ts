import type { RequestHandler } from 'express'
import config from '../config'

export const pathFragmentsToNotRedirect = [
  '/info',
  '/health',
  '/ping',
  '/maintenance',
  'sign-in',
  '/sign-out',
  'assets',
]

export default function siteMaintenanceRedirect(): RequestHandler {
  return (req, res, next) => {
    const inMaintenanceMode = config.maintenanceMode.enabled
    const doNotRedirect = pathFragmentsToNotRedirect.some(f => req.path.includes(f))

    if (inMaintenanceMode && !doNotRedirect) {
      return res.redirect('/maintenance')
    }

    return next()
  }
}
