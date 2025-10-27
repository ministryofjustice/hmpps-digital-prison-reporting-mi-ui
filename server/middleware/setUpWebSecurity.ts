import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
  // <script nonce="{{ cspNonce }}">
  // or
  // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
  // This ensures only scripts we trust are loaded, and not anything injected into the
  // page by an attacker.
  const scriptSrc = [
    "'self' https://browser.sentry-cdn.com https://js.sentry-cdn.com",
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
  ]
  const styleSrc = [
    "'self' https://browser.sentry-cdn.com https://js.sentry-cdn.com",
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
    'fonts.googleapis.com',
  ]
  const imgSrc = ["'self'", 'data:']
  const fontSrc = ["'self'", 'fonts.gstatic.com']
  const formAction = [`'self' ${config.apis.hmppsAuth.externalUrl} ${config.digitalPrisonServiceUrl}`]
  const connectSrc = [
    "'self' https://*.sentry.io https://browser.sentry-cdn.com https://northeurope-0.in.applicationinsights.azure.com https://js.monitor.azure.com",
  ]
  const workerSrc = ["'self' blob:"]

  if (config.apis.frontendComponents.url) {
    scriptSrc.push(config.apis.frontendComponents.url)
    styleSrc.push(config.apis.frontendComponents.url)
    imgSrc.push(config.apis.frontendComponents.url)
    fontSrc.push(config.apis.frontendComponents.url)
  }

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
          // <script nonce="{{ cspNonce }}">
          // or
          // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
          // This ensures only scripts we trust are loaded, and not anything injected into the
          // page by an attacker.
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          formAction,
          connectSrc,
          workerSrc,
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )
  return router
}
