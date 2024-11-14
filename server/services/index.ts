import ReportingService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/reportingService'
import DownloadPermissionService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/downloadPermissionService'
import { Services as dprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/Services'
import DashboardService from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/services/dashboardService'
import { createUserStoreServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/StoreServiceUtils'
import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = (): Services => {
  const { reportingClient, userClient, hmppsManageUsersClient, userDataStore, dashboardClient } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)
  const hmppsComponentsService = new HmppsComponentsService()
  const dashboardService = new DashboardService(dashboardClient)
  const downloadPermissionService = new DownloadPermissionService(userDataStore)
  const userStoreServices = createUserStoreServices(userDataStore)

  return {
    userService,
    reportingService,
    hmppsComponentsService,
    dashboardService,
    downloadPermissionService,
    ...userStoreServices,
  }
}

export type Services = dprServices & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
}

export { UserService }
