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

// ============================================================================
// Async Report Metrics
// ============================================================================

/**
 * Counter for async report requests
 * Labels: reportId, variantId, status ('requested', 'completed', 'failed', 'cancelled')
 */
export const asyncReportRequestsCounter = new promClient.Counter({
  name: 'dpr_ui_async_report_requests_total',
  help: 'Total number of async report requests',
  labelNames: ['reportId', 'variantId', 'status'],
})

/**
 * Gauge for currently running async reports
 */
export const asyncReportsInProgressGauge = new promClient.Gauge({
  name: 'dpr_ui_async_reports_in_progress',
  help: 'Number of async reports currently in progress',
})

/**
 * Histogram for async report completion time
 * Labels: reportId, variantId
 */
export const asyncReportDurationHistogram = new promClient.Histogram({
  name: 'dpr_ui_async_report_duration_seconds',
  help: 'Time taken for async reports to complete',
  buckets: [5, 10, 30, 60, 120, 300, 600, 1800],
  labelNames: ['reportId', 'variantId'],
})

// ============================================================================
// Establishment/Caseload Metrics
// ============================================================================

/**
 * Counter for report views by establishment
 * Labels: establishmentId, reportId
 */
export const reportViewsByEstablishmentCounter = new promClient.Counter({
  name: 'dpr_ui_report_views_by_establishment_total',
  help: 'Total report views by establishment/caseload',
  labelNames: ['establishmentId', 'reportId'],
})

/**
 * Gauge for active users by establishment
 * Labels: establishmentId
 */
export const activeUsersByEstablishmentGauge = new promClient.Gauge({
  name: 'dpr_ui_active_users_by_establishment',
  help: 'Number of active users by establishment',
  labelNames: ['establishmentId'],
})

// ============================================================================
// API Backend Metrics
// ============================================================================

/**
 * Counter for API calls by service
 * Labels: service (e.g., 'reporting-api', 'hmpps-auth', 'manage-users'), status
 */
export const apiCallsByServiceCounter = new promClient.Counter({
  name: 'dpr_ui_api_calls_by_service_total',
  help: 'Total API calls by backend service',
  labelNames: ['service', 'status'],
})

/**
 * Histogram for API response times by service
 * Labels: service, endpoint
 */
export const apiResponseTimeHistogram = new promClient.Histogram({
  name: 'dpr_ui_api_response_time_seconds',
  help: 'API response times by service',
  buckets: [0.1, 0.25, 0.5, 1, 2, 5, 10],
  labelNames: ['service', 'endpoint'],
})

// ============================================================================
// Report Catalog Metrics
// ============================================================================

/**
 * Gauge for total number of available reports
 */
export const availableReportsGauge = new promClient.Gauge({
  name: 'dpr_ui_available_reports',
  help: 'Number of reports available in the catalog',
})

/**
 * Counter for catalog/home page views
 */
export const catalogViewsCounter = new promClient.Counter({
  name: 'dpr_ui_catalog_views_total',
  help: 'Total number of catalog/home page views',
})

/**
 * Counter for report searches
 * Labels: hasResults ('true', 'false')
 */
export const reportSearchCounter = new promClient.Counter({
  name: 'dpr_ui_report_searches_total',
  help: 'Total number of report searches',
  labelNames: ['hasResults'],
})

// ============================================================================
// Frontend Components Metrics
// ============================================================================

/**
 * Counter for frontend component load events
 * Labels: component ('header', 'footer'), status ('success', 'failure')
 */
export const frontendComponentLoadCounter = new promClient.Counter({
  name: 'dpr_ui_frontend_component_loads_total',
  help: 'Total frontend component load attempts',
  labelNames: ['component', 'status'],
})

// ============================================================================
// Maintenance Mode Metrics
// ============================================================================

/**
 * Gauge for maintenance mode status (1 = enabled, 0 = disabled)
 */
export const maintenanceModeGauge = new promClient.Gauge({
  name: 'dpr_ui_maintenance_mode_enabled',
  help: 'Whether maintenance mode is enabled (1) or disabled (0)',
})

/**
 * Counter for requests blocked by maintenance mode
 */
export const maintenanceModeBlockedCounter = new promClient.Counter({
  name: 'dpr_ui_maintenance_mode_blocked_total',
  help: 'Total requests blocked by maintenance mode',
})
