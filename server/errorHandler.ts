import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export const USER_MESSAGE_PREFIX = 'User:'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    if (error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/authError')
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

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
