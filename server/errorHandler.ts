import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { applicationErrorsCounter, authEventsCounter } from './monitoring/customMetrics'

export const USER_MESSAGE_PREFIX = 'User:'

/**
 * Categorize error type for metrics
 */
function getErrorType(error: HTTPError, url: string): string {
  if (error.status === 401 || error.status === 403) return 'auth_error'
  if (error.message?.startsWith(USER_MESSAGE_PREFIX)) return 'user_error'
  if (url.includes('/api/') || error.status === 502 || error.status === 503) return 'api_error'
  if (error.status === 400) return 'validation_error'
  if (error.status === 404) return 'not_found'
  return 'internal_error'
}

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    const statusCode = error.status || 500
    const errorType = getErrorType(error, req.originalUrl)

    // Record error metric
    applicationErrorsCounter.labels(errorType, String(statusCode)).inc()

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      authEventsCounter.labels('forced_logout').inc()
      return res.redirect('/sign-out')
    }

    if (error.message.startsWith(USER_MESSAGE_PREFIX)) {
      res.locals.message = error.message.replace(USER_MESSAGE_PREFIX, '')
    } else {
      res.locals.message = production
        ? 'Something went wrong. The error has been logged. Please try again'
        : error.message
    }

    res.locals.status = error.status
    res.locals.stack = production ? null : error.stack

    res.status(statusCode)

    return res.render('pages/error')
  }
}
