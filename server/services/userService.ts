import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

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
    const validRole = 'ROLE_PRISONS_REPORTING_USER'
    return !roles.includes(validRole)
  }

  decodeJWT(token: string) {
    const arrayToken = token.split('.')
    return JSON.parse(atob(arrayToken[1]))
  }

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsManageUsersClient.getUser(token)
    const tokenPayload = this.decodeJWT(token)
    const activeCaseLoadId = await this.userClient.getActiveCaseload(token)
    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoadId,
      roles: tokenPayload.authorities,
    }
  }
}
