/* eslint-disable import/first, import/order */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import ReportingClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/reportingClient'
import HmppsAuthClient from './hmppsAuthClient'
import config from '../config'

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(),
  reportingClient: new ReportingClient(config.apis.reporting),
})

export { HmppsAuthClient }
