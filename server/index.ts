import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { services } from './services'

promClient.collectDefaultMetrics()

const serviceContainer = services()

// Run the reportId migration
Promise.resolve(serviceContainer.reportIdMigrationService.migrate()).catch(error => {
  // eslint-disable-next-line no-console
  console.error(error)
})

const app = createApp(serviceContainer)
const metricsApp = createMetricsApp()

export { app, metricsApp }
