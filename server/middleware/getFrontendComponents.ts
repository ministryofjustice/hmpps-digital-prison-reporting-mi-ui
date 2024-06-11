import type { RequestHandler } from 'express'

import logger from '../../logger'
import HmppsComponentsService from '../services/hmppsComponentsService'
import config from '../config'

export default function getFrontendComponents(hmppsComponentsService: HmppsComponentsService): RequestHandler {
  return async (_req, res, next) => {
    try {
      const { header, footer } = await hmppsComponentsService.getComponents(['header', 'footer'], res.locals.user.token)

      res.locals.feComponents = {
        cssIncludes: [...header.css, ...footer.css],
        footer: footer.html,
        header: header.html,
        jsIncludes: [...header.javascript, ...footer.javascript],
        dpsUrl: config.digitalPrisonServiceUrl,
      }
      next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
      next()
    }
  }
}
