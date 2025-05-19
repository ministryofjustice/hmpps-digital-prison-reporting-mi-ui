/* eslint-disable import/first, import/order */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import initDprReportingClients from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/data/dprReportingClient'
import HmppsAuthClient from './hmppsAuthClient'
import config from '../config'
import UserClient from './userClient'
import HmppsManageUsersClient from './hmppsManageUsersClient'
import { createRedisClient } from './redisClient'

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(),
  hmppsManageUsersClient: new HmppsManageUsersClient(),
  userClient: new UserClient(config.apis.reporting),
  ...initDprReportingClients(config.apis.reporting, createRedisClient(), 'userConfig:'),
})

export { HmppsAuthClient }
