import UserService from './userService'
import HmppsManageUsersClient, { CaseloadResponse, User, UserEmail } from '../data/hmppsManageUsersClient'
import UserClient from '../data/userClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('jwt-decode', () => ({ jwtDecode: () => ({ authorities: ['ROLE_PRISONS_REPORTING_USER'] }) }))

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
      hmppsManageUsersClient.getUserEmail = jest
        .fn()
        .mockResolvedValue({ username: 'johnSmith', email: 'johnsmith23904823492387@justice.gov.uk' } as UserEmail)
      hmppsManageUsersClient.getCaseloads = jest.fn().mockResolvedValue({ activeCaseload: 'KMI' } as CaseloadResponse)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
      expect(result.email).toEqual('johnsmith23904823492387@justice.gov.uk')
      expect(result.activeCaseLoadId).toEqual('KMI')
    })
    it('Propagates error', async () => {
      hmppsManageUsersClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
