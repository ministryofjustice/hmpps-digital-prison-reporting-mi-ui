import UserService from './userService'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'
import UserClient from '../data/userClient'

jest.mock('../data/hmppsAuthClient')

const token = 'some token'

describe('User service', () => {
  const hmppsAuthClient: jest.Mocked<HmppsAuthClient> = jest.createMockFromModule('../data/hmppsAuthClient')
  const userClient: jest.Mocked<UserClient> = jest.createMockFromModule('../data/userClient')
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      userService = new UserService(hmppsAuthClient, userClient)
    })
    it('Retrieves and formats user name', async () => {
      hmppsAuthClient.getUser = jest.fn().mockResolvedValue({ name: 'john smith' } as User)
      userClient.getActiveCaseload = jest.fn().mockResolvedValue('AAA')

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
      expect(result.activeCaseLoadId).toEqual('AAA')
    })
    it('Propagates error', async () => {
      hmppsAuthClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
