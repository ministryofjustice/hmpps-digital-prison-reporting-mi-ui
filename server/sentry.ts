import * as Sentry from '@sentry/node'
import config from './config'

if (config.sentry.dsn) {
  Sentry.init({
    ...(config.sentry.RELEASE_GIT_SHA && { release: config.sentry.RELEASE_GIT_SHA }),
    dsn: config.sentry.dsn,
    environment: config.environmentName,
    tracesSampleRate: config.sentry.tracesSampleRate,
    integrations: [Sentry.httpIntegration({ spans: false })],
  })
}
