import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface User {
  name: string
  activeCaseLoadId: string
  uuid: string
}

export interface UserRole {
  roleCode: string
}

export interface UserEmail {
  username: string
  email: string
  verified: boolean
}

export default class HmppsManageUsersClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Manage User Client', config.apis.manageUsers, token)
  }

  getUser(token: string): Promise<User> {
    logger.info(`Getting user details: calling HMPPS Manage User Client`)
    return HmppsManageUsersClient.restClient(token).get({ path: '/users/me' }) as Promise<User>
  }

  getUserEmail(token: string): Promise<UserEmail> {
    logger.info(`Getting current user details: calling HMPPS Auth`)
    return HmppsManageUsersClient.restClient(token).get({ path: '/users/me/email' }) as Promise<UserEmail>
  }
}
