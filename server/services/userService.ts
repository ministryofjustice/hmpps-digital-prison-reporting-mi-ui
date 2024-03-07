import { convertToTitleCase } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import UserClient from '../data/userClient'

export interface UserDetails {
  name: string
  displayName: string
  activeCaseLoadId?: string
}

export default class UserService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient, private readonly userClient: UserClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsAuthClient.getUser(token)
    const activeCaseLoadId = await this.userClient.getActiveCaseload(token)
    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoadId,
    }
  }
}
