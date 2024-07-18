import UserService from './userService'
import HmppsManageUsersClient, { User } from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

jest.mock('../data/hmppsAuthClient')

const token = 'some token'

describe('User service', () => {
  const hmppsManageUsersClient: jest.Mocked<HmppsManageUsersClient> = jest.createMockFromModule(
    '../data/hmppsManageUsersClient',
  )
  const userClient: jest.Mocked<UserClient> = jest.createMockFromModule('../data/userClient')
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      userService = new UserService(hmppsManageUsersClient, userClient)
    })
    it('Retrieves and formats user name', async () => {
      hmppsManageUsersClient.getUser = jest.fn().mockResolvedValue({ name: 'john smith' } as User)
      userClient.getActiveCaseload = jest.fn().mockResolvedValue('AAA')
      userService.decodeJWT = jest.fn().mockResolvedValue({ authorities: ['ROLE_PRISONS_REPORTING_USER'] })

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
      expect(result.activeCaseLoadId).toEqual('AAA')
    })
    it('Propagates error', async () => {
      hmppsManageUsersClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
