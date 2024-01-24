import type { RequestHandler } from 'express'
import config from '../config'

export default function siteMaintenanceRedirect(): RequestHandler {
  return (req, res, next) => {
    const inMaintenanceMode = config.maintenanceMode
    const onMaintenancePage = req.path === '/maintenance' || req.path.includes('assets')

    if (inMaintenanceMode && !onMaintenancePage) {
      return res.redirect('/maintenance')
    }

    return next()
  }
}
