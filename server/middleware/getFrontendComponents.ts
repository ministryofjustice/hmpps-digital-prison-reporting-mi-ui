import type { RequestHandler } from 'express'

import logger from '../../logger'
import HmppsComponentsService from '../services/hmppsComponentsService'
import config from '../config'
import { replaceHashWithSlash, rewriteFrontendComponentFooterLinks } from '../utils/probationFrontendComponentsHtml'

const emptyFeComponents = () => ({
  cssIncludes: [] as string[],
  footer: '',
  header: '',
  jsIncludes: [] as string[],
  dpsUrl: config.digitalPrisonServiceUrl,
})

export default function getFrontendComponents(hmppsComponentsService: HmppsComponentsService): RequestHandler {
  return async (req, res, next) => {
    res.locals.scopeMoJGovInitToMain = false
    try {
      if (res.locals.user) {
        const { header, footer } = await hmppsComponentsService.getComponents(
          ['header', 'footer'],
          res.locals.user.token,
        )

        const headerHtml = replaceHashWithSlash(header.html)
        res.locals.feComponents = {
          cssIncludes: [...header.css, ...footer.css],
          footer: rewriteFrontendComponentFooterLinks(footer.html, config.apis.frontendComponents.url),
          header: headerHtml,
          jsIncludes: [...header.javascript, ...footer.javascript],
          dpsUrl: config.digitalPrisonServiceUrl,
        }
        // MoJ Frontend's initAll() includes PdsHeader — it binds to `data-module="pds-header"` anywhere in
        // the document and clashes with the PDS header from the probation components API (hover CSS can
        // still work; clicks do not). Scope GOV/MoJ init to #main-content for that case only — prison DPS
        // headers may still need init on the full document (see assets/js/index.js).
        res.locals.scopeMoJGovInitToMain = Boolean(headerHtml.trim()) && config.isProbationService
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
