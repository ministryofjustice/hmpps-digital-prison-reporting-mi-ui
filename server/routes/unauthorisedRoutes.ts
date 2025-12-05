import { Router } from 'express'
import { routerGet } from './routerGet'
import config from '../config'

interface ServiceActiveAgencies {
  app: string
  activeAgencies: string[]
}

const applicationInfo: ServiceActiveAgencies = {
  app: 'Digital Prison Reporting',
  activeAgencies: config.activeEstablishments,
}

export const unauthorisedRoutes = () => {
  const router = Router()
  const get = routerGet(router)

  get('/maintenance', (_req, res) => {
    if (config.maintenanceMode.enabled) {
      res.render('pages/maintenance', {
        title: 'Site Maintenance',
        description: config.maintenanceMode.message,
      })
    } else {
      res.redirect('/')
    }
  })

  get('/info', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(applicationInfo))
  })

  return router
}
