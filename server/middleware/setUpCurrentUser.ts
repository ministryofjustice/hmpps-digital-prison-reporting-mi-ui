import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from './populateCurrentUser'
import type { Services } from '../services'

export default function setUpCurrentUser({
  userService,
  asyncReportsStore,
  recentlyViewedStoreService,
  bookmarkService,
}: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser(userService, asyncReportsStore, recentlyViewedStoreService, bookmarkService))
  return router
}
