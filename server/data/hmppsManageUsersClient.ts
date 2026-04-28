import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface User {
  username: string
  active: boolean
  name: string
  authSource: 'nomis' | 'none' | 'delius'
  userId: string
  uuid: string
  staffId?: number
  activeCaseLoadId?: string
}

export interface UserRole {
  roleCode: string
}

export interface UserEmail {
  username: string
  email: string
  verified: boolean
}

export interface CaseloadResponse {
  username: string
  active: boolean
  accountType: string
  activeCaseload: string
  caseloads: {
    id: string
    name: string
    function: string
  }[]
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

  getCaseloads(token: string): Promise<CaseloadResponse> {
    logger.info(`Getting caseloads: calling HMPPS Auth`)
    return HmppsManageUsersClient.restClient(token).get({ path: '/users/me/caseloads' }) as Promise<CaseloadResponse>
  }
}
