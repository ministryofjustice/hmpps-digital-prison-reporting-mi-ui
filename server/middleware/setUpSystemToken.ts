import { Router } from 'express'
import type { Services } from '../services'
import populateSystemToken from './populateSystemToken'

export default function setUpSystemToken(services: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(populateSystemToken(services))
  return router
}
