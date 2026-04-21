import {
  type dprServices,
  createDprServices,
} from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/createDprServices'

import { dataAccess } from '../data'
import UserService from './userService'
import HmppsComponentsService from './hmppsComponentsService'
import { AppFeatureFlagService } from './featureFlagService'
import SystemTokenService from './systemTokenService'
import config from '../config'

export const services = (): Services => {
  const { userClient, hmppsAuthClient, hmppsManageUsersClient, appFeatureFlagService, ...dprClients } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient)
  const hmppsComponentsService = new HmppsComponentsService()

  const serviceConfig = {
    bookmarking: true,
    download: true,
    collections: true,
    missingReports: true,
    saveDefaults: true,
    feedbackOnDownload: true,
  }
  const dprServices = createDprServices(dprClients, serviceConfig)

  const systemTokenService = new SystemTokenService(hmppsAuthClient, config.systemTokenEnabled)

  return {
    userService,
    hmppsComponentsService,
    appFeatureFlagService,
    systemTokenService,
    ...dprServices,
  }
}

export type Services = dprServices & {
  hmppsComponentsService: HmppsComponentsService
  userService: UserService
  appFeatureFlagService: AppFeatureFlagService
  systemTokenService: SystemTokenService
}

export { UserService }
