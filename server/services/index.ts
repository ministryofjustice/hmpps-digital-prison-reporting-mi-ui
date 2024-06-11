import { dataAccess } from '../data'
import UserService from './userService'
import ReportingService from './reportingService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = () => {
  const { reportingClient, userClient, hmppsManageUsersClient } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)
  const hmppsComponentsService = new HmppsComponentsService()

  return {
    userService,
    reportingService,
    hmppsComponentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
