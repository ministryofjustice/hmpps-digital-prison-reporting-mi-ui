import { Services as dprServicesType } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/Services'
import { createDprServices } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/utils/CreateDprServices'

import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'
import { AppFeatureFlagService } from './featureFlagService'

export const services = (): Services => {
  const { userClient, hmppsManageUsersClient, appFeatureFlagService, ...dprClients } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const hmppsComponentsService = new HmppsComponentsService()

  const serviceConfig = {
    bookmarking: true,
    download: true,
    collections: true,
    missingReports: true,
    saveDefaults: true,
  }
  const dprServices = createDprServices(
    {
      ...dprClients,
    },
    serviceConfig,
  )

  return {
    userService,
    hmppsComponentsService,
    appFeatureFlagService,
    ...dprServices,
  }
}

export type Services = dprServicesType & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
  appFeatureFlagService: AppFeatureFlagService
}

export { UserService }
