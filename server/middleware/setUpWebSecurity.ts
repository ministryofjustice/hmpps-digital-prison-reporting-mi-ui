import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'
import config from '../config'

function tryOrigin(url: string): string | undefined {
  try {
    return new URL(url).origin
  } catch {
    return undefined
  }
}

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
    'https://js.monitor.azure.com',
    'https://*.applicationinsights.azure.com',
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
  ]

  // Nonces apply to <style> / <link rel="stylesheet">, not to HTML style="..." attributes.
  // MoJ / PDS / HMPPS frontend components set inline style attributes (e.g. navigation menus).
  // CSP3: allow those via style-src-attr while keeping stylesheet loads nonce-based on style-src.
  const styleSrc = [
    "'self'",
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
    'https://fonts.googleapis.com',
  ]
  const styleSrcAttr = ["'unsafe-inline'"]

  const imgSrc = ["'self'", 'data:']

  const fontSrc = ["'self'", 'https://fonts.gstatic.com']

  const formAction = [`'self' ${config.apis.hmppsAuth.externalUrl} ${config.digitalPrisonServiceUrl}`]

  const frontendComponentsOrigin = config.apis.frontendComponents.url && tryOrigin(config.apis.frontendComponents.url)

  const frameSrc = ["'self'"]
  if (frontendComponentsOrigin) {
    frameSrc.push(frontendComponentsOrigin)
  }

  const connectSrc = (() => {
    const sources = [
      "'self'",
      'https://*.sentry.io',
      'https://*.sentry-cdn.com',
      'https://browser.sentry-cdn.com',
      'https://northeurope-0.in.applicationinsights.azure.com',
      'https://js.monitor.azure.com',
      'https://*.applicationinsights.azure.com',
    ]

    if (frontendComponentsOrigin) {
      sources.push(frontendComponentsOrigin)
    }

    const fliptOrigin = config.featureFlagConfig.url && tryOrigin(config.featureFlagConfig.url)
    if (fliptOrigin) {
      sources.push(fliptOrigin)
    }

    if (config.environmentName === 'local') {
      sources.push('http://localhost:3000')
      sources.push('http://localhost:3002')
      sources.push('http://localhost:8100')
      sources.push('http://localhost:9090')
      sources.push('http://localhost:9091')
    }

    return sources
  })()

  const workerSrc = ["'self'", 'blob:']
  if (frontendComponentsOrigin) {
    workerSrc.push(frontendComponentsOrigin)
  }

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
          defaultSrc: ["'self'", 'https://js.monitor.azure.com', 'https://*.applicationinsights.azure.com'],
          scriptSrc,
          styleSrc,
          styleSrcAttr,
          fontSrc,
          imgSrc,
          formAction,
          connectSrc,
          frameSrc,
          workerSrc,
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )
  return router
}
