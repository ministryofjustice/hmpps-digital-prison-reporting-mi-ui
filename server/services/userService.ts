import jwtDecode from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'
import config from '../config'

export interface UserDetails {
  name: string
  displayName: string
  activeCaseLoadId?: string
  roles: string[]
  uuid: string
}

export default class UserService {
  constructor(
    private readonly hmppsManageUsersClient: HmppsManageUsersClient,
    private readonly userClient: UserClient,
  ) {}

  userIsUnauthorisedByRole(roles: string[]) {
    const authorisedRoles = config.authorisation.roles.length
      ? config.authorisation.roles
      : ['ROLE_PRISONS_REPORTING_USER']

    if (!roles) {
      return true
    }

    return !roles.some((role: string) => authorisedRoles.includes(role))
  }

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsManageUsersClient.getUser(token)
    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }
    let activeCaseLoadId
    if (!this.userIsUnauthorisedByRole(roles)) {
      activeCaseLoadId = await this.userClient.getActiveCaseload(token)
    }
    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoadId,
      roles,
    }
  }
}
