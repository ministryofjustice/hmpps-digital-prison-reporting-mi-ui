/* eslint no-param-reassign: 0 */

import {
  setup,
  defaultClient,
  TelemetryClient,
  DistributedTracingModes,
  Contracts,
  getCorrelationContext,
} from 'applicationinsights'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import {
  RecentlyViewedReport,
  RequestedReport,
} from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/UserReports'
import { RequestHandler, Request } from 'express'
import { v4 } from 'uuid'
import applicationVersion from '../applicationVersion'
import Dict = NodeJS.Dict

function defaultName(): string {
  const {
    packageData: { name },
  } = applicationVersion
  return name
}

function version(): string {
  const { buildNumber } = applicationVersion
  return buildNumber
}

export type ContextObject = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  [name: string]: any
}

type CustomData = {
  username: string
  activeCaseLoadId: string
  product?: string
  reportName?: string
  page?: number | string
}
const getCustomData = (
  params: Dict<string>,
  query: Request['query'],
  body: Dict<string>,
  locals: Dict<any>,
): CustomData | object => {
  if (locals.user) {
    const { username, activeCaseLoadId } = locals.user
    const selectedPage = query ? query.selectedPage : null
    const { tableId } = params
    const executionId = params.executionId ?? body?.executionId

    let reportName
    let variantName
    let requestReportData

    if (locals.requestedReports) {
      requestReportData = locals.requestedReports.find(
        (r: RequestedReport) => r.executionId === executionId || r.tableId === tableId,
      )
    }

    if (!requestReportData && locals.recentlyViewedReports) {
      requestReportData = locals.recentlyViewedReports.find(
        (r: RecentlyViewedReport) => r.executionId === executionId || r.tableId === tableId,
      )
    }

    if (requestReportData) {
      reportName = requestReportData.reportName
      variantName = requestReportData.variantName ?? requestReportData.name
    }

    if (locals.definitions && (!reportName || !variantName)) {
      const reportId = params.reportId ?? params.report ?? body?.reportId
      const variantId = params.variantId ?? params.variant ?? params.id ?? body?.id

      locals.definitions
        .filter((r: components['schemas']['ReportDefinitionSummary']) => r.id === reportId)
        .forEach((r: components['schemas']['ReportDefinitionSummary']) => {
          reportName = r.name

          r.variants
            .filter((v: components['schemas']['VariantDefinitionSummary']) => v.id === variantId)
            .forEach(v => {
              variantName = v.name
            })
        })
    }

    return {
      username,
      activeCaseLoadId,
      product: reportName,
      reportName: variantName,
      page: selectedPage ? Number(selectedPage) : '',
    }
  }

  return {}
}

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context) {
        if (req.route) {
          context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path.replace(',', '|')}`)
          context.customProperties.setProperty('operationId', v4())
        }
        const customData = getCustomData(req.params, req.query, req.body, res.locals)
        Object.entries(customData).forEach(([k, v]) => context.customProperties.setProperty(k, String(v)))
      }
    })
    next()
  }
}

function addUserDataToRequests(envelope: EnvelopeTelemetry, contextObjects: Record<string, unknown> | undefined) {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const { username, activeCaseLoad } =
      (contextObjects?.['http.ServerRequest'] as Request | undefined)?.res?.locals?.user || {}
    if (username) {
      const properties = envelope.data.baseData?.properties
      envelope.data.baseData ??= {}
      envelope.data.baseData.properties = {
        username,
        activeCaseLoadId: activeCaseLoad?.caseLoadId,
        ...properties,
      }
    }
  }
  return true
}

const addQueryDataToRequests = ({ tags, data }: EnvelopeTelemetry, contextObjects: { [name: string]: any }) => {
  const customProperties = contextObjects?.correlationContext?.customProperties
  const operationNameOverride = customProperties?.getProperty('operationName')
  const usernameOverride = customProperties?.getProperty('username')
  const activeCaseLoadIdOverride = customProperties?.getProperty('activeCaseLoadId')
  const productOverride = customProperties?.getProperty('product')
  const reportNameOverride = customProperties?.getProperty('reportName')
  const pageOverride = customProperties?.getProperty('page')
  if (operationNameOverride && tags) {
    tags['ai.operation.name'] = operationNameOverride
    tags['ai.operation.username'] = usernameOverride
    tags['ai.operation.activecaseloadid'] = activeCaseLoadIdOverride
    tags['ai.operation.product'] = productOverride
    tags['ai.operation.report_name'] = reportNameOverride
    tags['ai.operation.page'] = pageOverride
    if (data?.baseData) {
      data.baseData.name = operationNameOverride
      data.baseData.username = usernameOverride
      data.baseData.activecaseloadid = activeCaseLoadIdOverride
      data.baseData.product = productOverride
      data.baseData.report_name = reportNameOverride
      data.baseData.page = pageOverride
    }
  }
  return true
}

export function buildAppInsightsClient(name = defaultName()): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = name
    defaultClient.context.tags['ai.application.ver'] = version()
    defaultClient.addTelemetryProcessor(({ data }) => {
      const { url } = data.baseData!
      return !url?.endsWith('/health') && !url?.endsWith('/ping') && !url?.endsWith('/metrics')
    })
    defaultClient.addTelemetryProcessor(addUserDataToRequests)
    defaultClient.addTelemetryProcessor(addQueryDataToRequests)
    return defaultClient
  }
  return null
}
