import type { RequestHandler } from 'express'

import asyncMiddleware from './asyncMiddleware'
import { ignoreAuthPaths } from '../authentication/auth'

export default function authorisationMiddleware(): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    const ignorePaths = [...ignoreAuthPaths, '/']

    if (ignorePaths.includes(req.originalUrl)) {
      return next()
    }

    if (res.locals?.user?.token) {
      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })
}
