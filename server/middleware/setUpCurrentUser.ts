import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from './populateCurrentUser'
import type { Services } from '../services'

export default function setUpCurrentUser({
  userService,
  requestedReportService,
  recentlyViewedService,
  bookmarkService,
}: Services): Router {
  const router = Router({ mergeParams: true })

  router.get('/roleError', (req, res) => {
    res.status(401)
    return res.render('roleError')
  })

  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser(userService, requestedReportService, recentlyViewedService, bookmarkService))
  return router
}
