import RequestedReportService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/requestedReportService'
import RecentlyViewedStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/recentlyViewedService'
import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import BookmarkService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/bookmarkService'
import { Services as dprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/Services'
import DashboardService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/dashboardService'
import MetricService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/metricsService'
import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = (): Services => {
  const { reportingClient, userClient, hmppsManageUsersClient, userDataStore, dashboardClient, metricsClient } =
    dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)
  const hmppsComponentsService = new HmppsComponentsService()
  const requestedReportService = new RequestedReportService(userDataStore)
  const recentlyViewedService = new RecentlyViewedStoreService(userDataStore)
  const bookmarkService = new BookmarkService(userDataStore)
  const metricService = new MetricService(metricsClient)
  const dashboardService = new DashboardService(dashboardClient)

  return {
    userService,
    reportingService,
    hmppsComponentsService,
    requestedReportService,
    recentlyViewedService,
    bookmarkService,
    metricService,
    dashboardService,
  }
}

export type Services = dprServices & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
  metricService: MetricService
  dashboardService: DashboardService
}

export { UserService }
