import type { RequestHandler } from 'express'
import config from '../config'
import { maintenanceModeGauge, maintenanceModeBlockedCounter } from '../monitoring/customMetrics'

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

    // Update maintenance mode gauge (1 = enabled, 0 = disabled)
    maintenanceModeGauge.set(inMaintenanceMode ? 1 : 0)

    if (inMaintenanceMode && !doNotRedirect) {
      // Record blocked request
      maintenanceModeBlockedCounter.inc()
      return res.redirect('/maintenance')
    }

    return next()
  }
}
