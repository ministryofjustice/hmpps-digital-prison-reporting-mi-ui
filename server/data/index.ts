/* eslint-disable import/first, import/order */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import ReportingClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/reportingClient'
import MetricsClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/metricsClient'
import DashboardClient from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/dashboardClient'
import UserDataStore from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/userDataStore'
import HmppsAuthClient from './hmppsAuthClient'
import config from '../config'
import UserClient from './userClient'
import HmppsManageUsersClient from './hmppsManageUsersClient'
import { createRedisClient } from './redisClient'

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(),
  hmppsManageUsersClient: new HmppsManageUsersClient(),
  reportingClient: new ReportingClient(config.apis.reporting),
  metricsClient: new MetricsClient(config.apis.reporting),
  dashboardClient: new DashboardClient(config.apis.reporting),
  userClient: new UserClient(config.apis.reporting),
  userDataStore: new UserDataStore(createRedisClient()),
})

export { HmppsAuthClient }
