import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { services } from './services'

// Import custom metrics to ensure they're registered with prom-client
import './monitoring/customMetrics'

promClient.collectDefaultMetrics()

const app = createApp(services())
const metricsApp = createMetricsApp()

export { app, metricsApp }
