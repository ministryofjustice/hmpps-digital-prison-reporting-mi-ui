import promClient from 'prom-client'

/**
 * Custom application metrics for Digital Prison Reporting MI UI
 *
 * These metrics provide business-level insights into:
 * - Report views and downloads
 * - User sessions
 * - Feature flag evaluations
 * - Authentication events
 * - Redis cache operations
 *
 * All metrics are automatically scraped by Prometheus via the /metrics endpoint.
 * For batch/ephemeral operations, push to the Pushgateway using pushMetrics().
 */

// ============================================================================
// Report Metrics
// ============================================================================

/**
 * Counter for report views
 * Labels: reportId, variantId, template (e.g., 'list', 'summary')
 */
export const reportViewsCounter = new promClient.Counter({
  name: 'dpr_ui_report_views_total',
  help: 'Total number of report views',
  labelNames: ['reportId', 'variantId', 'template'],
})

/**
 * Counter for report downloads/exports
 * Labels: reportId, variantId, format (e.g., 'csv', 'xlsx')
 */
export const reportDownloadsCounter = new promClient.Counter({
  name: 'dpr_ui_report_downloads_total',
  help: 'Total number of report downloads',
  labelNames: ['reportId', 'variantId', 'format'],
})

/**
 * Histogram for report data load time
 * Labels: reportId, variantId
 */
export const reportLoadTimeHistogram = new promClient.Histogram({
  name: 'dpr_ui_report_load_seconds',
  help: 'Time taken to load report data',
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  labelNames: ['reportId', 'variantId'],
})

// ============================================================================
// Session Metrics
// ============================================================================

/**
 * Gauge for active user sessions
 * This is typically updated by a background job or on session events
 */
export const activeSessionsGauge = new promClient.Gauge({
  name: 'dpr_ui_active_sessions',
  help: 'Number of active user sessions',
})

/**
 * Counter for session events
 * Labels: event (e.g., 'created', 'expired', 'destroyed')
 */
export const sessionEventsCounter = new promClient.Counter({
  name: 'dpr_ui_session_events_total',
  help: 'Total number of session events',
  labelNames: ['event'],
})

// ============================================================================
// Authentication Metrics
// ============================================================================

/**
 * Counter for authentication events
 * Labels: event (e.g., 'login_success', 'login_failure', 'logout', 'token_refresh')
 */
export const authEventsCounter = new promClient.Counter({
  name: 'dpr_ui_auth_events_total',
  help: 'Total number of authentication events',
  labelNames: ['event'],
})

// ============================================================================
// Feature Flag Metrics
// ============================================================================

/**
 * Counter for feature flag evaluations
 * Labels: flag (name), result ('enabled', 'disabled')
 */
export const featureFlagEvaluationsCounter = new promClient.Counter({
  name: 'dpr_ui_feature_flag_evaluations_total',
  help: 'Total number of feature flag evaluations',
  labelNames: ['flag', 'result'],
})

// ============================================================================
// User Interaction Metrics
// ============================================================================

/**
 * Counter for bookmark actions
 * Labels: action ('add', 'remove')
 */
export const bookmarkActionsCounter = new promClient.Counter({
  name: 'dpr_ui_bookmark_actions_total',
  help: 'Total number of bookmark actions',
  labelNames: ['action'],
})

/**
 * Counter for report filter applications
 * Labels: reportId
 */
export const filterApplicationsCounter = new promClient.Counter({
  name: 'dpr_ui_filter_applications_total',
  help: 'Total number of filter applications',
  labelNames: ['reportId'],
})

// ============================================================================
// Cache Metrics (Redis)
// ============================================================================

/**
 * Counter for Redis cache operations
 * Labels: operation ('get', 'set', 'del'), result ('hit', 'miss', 'error')
 */
export const redisCacheOperationsCounter = new promClient.Counter({
  name: 'dpr_ui_redis_cache_operations_total',
  help: 'Total number of Redis cache operations',
  labelNames: ['operation', 'result'],
})

// ============================================================================
// Error Metrics
// ============================================================================

/**
 * Counter for application errors
 * Labels: type (e.g., 'api_error', 'validation_error', 'auth_error'), statusCode
 */
export const applicationErrorsCounter = new promClient.Counter({
  name: 'dpr_ui_application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['type', 'statusCode'],
})
