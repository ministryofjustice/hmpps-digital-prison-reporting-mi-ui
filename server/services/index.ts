import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import { Services as dprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/Services'
import DashboardService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/dashboardService'
import MetricService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/metricsService'
import { createUserStoreServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/StoreServiceUtils'
import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = (): Services => {
  const { reportingClient, userClient, hmppsManageUsersClient, userDataStore, dashboardClient, metricsClient } =
    dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)
  const hmppsComponentsService = new HmppsComponentsService()
  const metricService = new MetricService(metricsClient)
  const dashboardService = new DashboardService(dashboardClient)
  const userStoreServices = createUserStoreServices(userDataStore)

  return {
    userService,
    reportingService,
    hmppsComponentsService,
    metricService,
    dashboardService,
    ...userStoreServices,
  }
}

export type Services = dprServices & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
}

export { UserService }
