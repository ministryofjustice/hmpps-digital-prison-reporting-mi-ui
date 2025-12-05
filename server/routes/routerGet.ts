import { RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export const routerGet = (router: Router) => (path: string | string[], handler: RequestHandler) =>
  router.get(path, asyncMiddleware(handler))
