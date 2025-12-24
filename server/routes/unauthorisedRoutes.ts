import { Router } from 'express'
import { routerGet } from './routerGet'
import config from '../config'
import { FeatureFlagService } from '../services/featureFlagService'

interface ServiceActiveAgencies {
  app: string
  activeAgencies: string[]
}

const applicationInfo: ServiceActiveAgencies = {
  app: 'Digital Prison Reporting',
  activeAgencies: config.activeEstablishments,
}

export const unauthorisedRoutes = (featureFlagService: FeatureFlagService) => {
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

  get('/info', async (_req, res) => {
    const info = {
      ...applicationInfo,
    }
    const activePrionsEvaluation = featureFlagService.enabled
      ? await featureFlagService.evaluateFlag('activeEstablishments', 'VARIANT_FLAG_TYPE')
      : undefined
    if (activePrionsEvaluation) {
      const activePrisons = JSON.parse(activePrionsEvaluation.variantAttachment) as string[]
      if (activePrisons && activePrisons.length > info.activeAgencies.length) {
        info.activeAgencies = activePrisons
      }
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(info))
  })

  return router
}
