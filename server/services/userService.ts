import { convertToTitleCase } from '../utils/utils'
import type HmppsManageUsersClient from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

export interface UserDetails {
  name: string
  displayName: string
  activeCaseLoadId?: string
}

export default class UserService {
  constructor(
    private readonly hmppsManageUsersClient: HmppsManageUsersClient,
    private readonly userClient: UserClient,
  ) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsManageUsersClient.getUser(token)
    const activeCaseLoadId = await this.userClient.getActiveCaseload(token)
    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoadId,
    }
  }
}
