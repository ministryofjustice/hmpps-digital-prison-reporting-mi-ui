import { jwtDecode } from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import { AuthSource } from '../config'

export interface UserDetails {
  name: string
  displayName: string
  authSource: AuthSource
  activeCaseLoadId?: string
  roles: string[]
  uuid: string
  email: string
}

export default class UserService {
  constructor(private readonly hmppsManageUsersClient: HmppsManageUsersClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const [user, userEmail] = await Promise.all([
      this.hmppsManageUsersClient.getUser(token),
      this.hmppsManageUsersClient.getUserEmail(token),
    ])

    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }

    const userObj = {
      ...user,
      displayName: convertToTitleCase(user.name),
      roles,
      email: userEmail.email,
    }

    if (user.authSource === 'nomis') {
      const caseloads = await this.hmppsManageUsersClient.getCaseloads(token)
      userObj.activeCaseLoadId = caseloads.activeCaseload
    }

    return userObj
  }
}
