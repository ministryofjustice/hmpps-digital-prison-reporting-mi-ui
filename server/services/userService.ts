import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'
import config from '../config'

export interface UserDetails {
  name: string
  displayName: string
  activeCaseLoadId?: string
  roles: string[]
}

export default class UserService {
  constructor(
    private readonly hmppsManageUsersClient: HmppsManageUsersClient,
    private readonly userClient: UserClient,
  ) {}

  userIsUnathorisedByRole(roles: string[]) {
    const authorisedRoles = config.authorisation.roles
    return (
      authorisedRoles && authorisedRoles.length > 0 && !roles.some((role: string) => authorisedRoles.includes(role))
    )
  }

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsManageUsersClient.getUser(token)
    const roles = await this.hmppsManageUsersClient.getUserRoles(token)
    let activeCaseLoadId
    if (!this.userIsUnathorisedByRole(roles)) {
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
