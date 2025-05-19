import { Services as dprServicesType } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/Services'
import createDprServices from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/ReportStoreServiceUtils'

import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = (): Services => {
  const { reportingClient, userClient, hmppsManageUsersClient, reportDataStore, dashboardClient } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const hmppsComponentsService = new HmppsComponentsService()
  const dprServices = createDprServices({ reportingClient, dashboardClient, reportDataStore })

  return {
    userService,
    hmppsComponentsService,
    ...dprServices,
  }
}

export type Services = dprServicesType & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
}

export { UserService }
