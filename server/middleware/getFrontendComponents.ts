import type { RequestHandler } from 'express'

import logger from '../../logger'
import HmppsComponentsService from '../services/hmppsComponentsService'
import config from '../config'

const emptyFeComponents = () => ({
  cssIncludes: [] as string[],
  footer: '',
  header: '',
  jsIncludes: [] as string[],
  dpsUrl: config.digitalPrisonServiceUrl,
})

export default function getFrontendComponents(hmppsComponentsService: HmppsComponentsService): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const { header, footer } = await hmppsComponentsService.getComponents(
          ['header', 'footer'],
          res.locals.user.token,
        )

        res.locals.feComponents = {
          cssIncludes: [...header.css, ...footer.css],
          footer: footer.html,
          header: header.html,
          jsIncludes: [...header.javascript, ...footer.javascript],
          dpsUrl: config.digitalPrisonServiceUrl,
        }
      } else {
        logger.debug(`Did not retrieve front end components for endpoint: ${req.originalUrl}`)
        res.locals.feComponents = emptyFeComponents()
      }
      next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
      res.locals.feComponents = emptyFeComponents()
      next()
    }
  }
}
