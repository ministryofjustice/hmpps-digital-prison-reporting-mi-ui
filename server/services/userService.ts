import jwtDecode from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

export interface UserDetails {
  name: string
  displayName: string
  activeCaseLoadId?: string
  roles: string[]
  uuid: string
  email: string
}

export default class UserService {
  constructor(
    private readonly hmppsManageUsersClient: HmppsManageUsersClient,
    private readonly userClient: UserClient,
  ) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsManageUsersClient.getUser(token)
    const { email } = await this.hmppsManageUsersClient.getUserEmail(token)
    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }
    const activeCaseLoadId = await this.userClient.getActiveCaseload(token)

    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoadId,
      roles,
      email,
    }
  }
}
