import type { RequestHandler } from 'express'
import config from '../config'
import logger from '../../logger'

const normaliseAuthSource = (authSource: string | undefined): string | undefined => authSource?.toLowerCase()

export default function authoriseAuthSource(): RequestHandler {
  return (req, res, next) => {
    const requiredAuthSources = config.requiredAuthSources.map(normaliseAuthSource)
    const userAuthSource = normaliseAuthSource(res.locals.user?.authSource ?? req.user?.authSource)

    if (!userAuthSource || requiredAuthSources.includes(userAuthSource)) {
      return next()
    }

    logger.warn(
      {
        username: res.locals.user?.username ?? req.user?.username,
        requiredAuthSources,
        userAuthSource,
        path: req.originalUrl,
      },
      'User attempted to access service with the wrong auth source',
    )

    return res.status(403).render('autherror', {
      userAuthSource,
      requiredAuthSources,
    })
  }
}
