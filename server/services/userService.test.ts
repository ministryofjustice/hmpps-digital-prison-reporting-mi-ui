import UserService from './userService'
import HmppsManageUsersClient, { User } from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('jwt-decode', () => () => ({ authorities: ['ROLE_PRISONS_REPORTING_USER'] }))

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

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
      expect(result.activeCaseLoadId).toEqual('AAA')
    })
    it('Propagates error', async () => {
      hmppsManageUsersClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })

    it('validates the user roles', () => {
      const result1 = userService.userIsUnauthorisedByRole(['ROLE_PRISONS_REPORTING_USER'])
      expect(result1).toBeFalsy()

      const result2 = userService.userIsUnauthorisedByRole(['PRISONS_REPORTIN_AAA'])
      expect(result2).toBeTruthy()
    })

    it('does not fail when the user has no roles', () => {
      const result1 = userService.userIsUnauthorisedByRole(null)
      expect(result1).toBeTruthy()
    })
  })
})
