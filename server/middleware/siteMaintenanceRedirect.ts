import type { RequestHandler } from 'express'
import config from '../config'

export default function siteMaintenanceRedirect(): RequestHandler {
  return (req, res, next) => {
    if (config.maintenanceMode) {
      return res.redirect('/maintenance')
    }
    return next()
  }
}
