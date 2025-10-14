import * as Sentry from '@sentry/node'
import config from './config'

if (config.sentry.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.environmentName,
    tracesSampleRate: config.sentry.tracesSampleRate,
  })
}
