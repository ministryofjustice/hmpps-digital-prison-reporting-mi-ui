import jwtDecode from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

const ignoreAuthPaths = ['/', '/info']

export default function authorisationMiddleware(authorisedRoles: string[] = []): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    if (ignoreAuthPaths.includes(req.originalUrl)) {
      return next()
    }

    if (res.locals?.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedRoles && authorisedRoles.length > 0 && !roles.some(role => authorisedRoles.includes(role))) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })
}
