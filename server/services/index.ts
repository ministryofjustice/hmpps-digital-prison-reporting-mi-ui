import { dataAccess } from '../data'
import UserService from './userService'
import ReportingService from './reportingService'

export const services = () => {
  const { reportingClient, userClient, hmppsManageUsersClient } = dataAccess()

  const userService = new UserService(hmppsManageUsersClient, userClient)
  const reportingService = new ReportingService(reportingClient)

  return {
    userService,
    reportingService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
