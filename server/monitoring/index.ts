/**
 * Monitoring module exports
 *
 * This module provides:
 * - metricsMiddleware: Express middleware for HTTP metrics
 * - createMetricsApp: Factory for the metrics endpoint app
 * - Custom application metrics for business-level insights
 */

export { metricsMiddleware, createMetricsApp } from './metricsApp'

// Export all custom metrics for use throughout the application
export {
  // Report metrics
  reportViewsCounter,
  reportDownloadsCounter,
  reportLoadTimeHistogram,
  // Session metrics
  activeSessionsGauge,
  sessionEventsCounter,
  // Auth metrics
  authEventsCounter,
  // Feature flag metrics
  featureFlagEvaluationsCounter,
  // User interaction metrics
  bookmarkActionsCounter,
  filterApplicationsCounter,
  // Cache metrics
  redisCacheOperationsCounter,
  // Error metrics
  applicationErrorsCounter,
} from './customMetrics'

