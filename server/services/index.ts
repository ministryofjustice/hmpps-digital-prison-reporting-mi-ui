import AsyncReportStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/requestedReportsService'
import RecentlyViewedStoreService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/recentlyViewedService'
import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = () => {
  const { reportingClient, userClient, hmppsManageUsersClient, userDataStore } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)
  const hmppsComponentsService = new HmppsComponentsService()
  const asyncReportsStore = new AsyncReportStoreService(userDataStore)
  const recentlyViewedStoreService = new RecentlyViewedStoreService(userDataStore)

  return {
    userService,
    reportingService,
    hmppsComponentsService,
    asyncReportsStore,
    recentlyViewedStoreService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
