import { setup, defaultClient, TelemetryClient, DistributedTracingModes, Contracts } from 'applicationinsights'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import {
  RecentlyViewedReport,
  RequestedReport,
} from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/UserReports'
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

const getCustomData = (params: Dict<string>, query: Dict<string>, body: Dict<string>, locals: Dict<any>) => {
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
      page: selectedPage ? Number(selectedPage) : null,
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

export function buildAppInsightsClient(name = defaultName()): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = name
    defaultClient.context.tags['ai.application.ver'] = version()
    defaultClient.addTelemetryProcessor(addCustomDataToRequests)
    return defaultClient
  }
  return null
}

export function addCustomDataToRequests(envelope: EnvelopeTelemetry, contextObjects: ContextObject) {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const customData = getCustomData(
      contextObjects?.['http.ServerRequest'].params,
      contextObjects?.['http.ServerRequest'].query,
      contextObjects?.['http.ServerRequest'].body,
      contextObjects?.['http.ServerResponse'].locals,
    )
    if (customData) {
      const { properties } = envelope.data.baseData
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = {
        ...properties,
        ...customData,
      }
    }
  }
  return true
}
