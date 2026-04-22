import UserService from './userService'
import HmppsManageUsersClient, { CaseloadResponse, User, UserEmail } from '../data/hmppsManageUsersClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('jwt-decode', () => ({ jwtDecode: () => ({ authorities: ['ROLE_PRISONS_REPORTING_USER'] }) }))

const token = 'some token'

describe('User service', () => {
  const hmppsManageUsersClient: jest.Mocked<HmppsManageUsersClient> = jest.createMockFromModule(
    '../data/hmppsManageUsersClient',
  )
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      userService = new UserService(hmppsManageUsersClient)
    })
    it('Retrieves and formats user name from nomis', async () => {
      hmppsManageUsersClient.getUser = jest.fn().mockResolvedValue({
        username: 'FOOBAR',
        active: true,
        name: 'foo bar',
        authSource: 'nomis',
        userId: '123456',
        uuid: '1a1a1a-1a1a1a1-1a1a1a1-1a1a1a1',
        activeCaseLoadId: 'KMI',
        staffId: 123456,
      } as User)
      hmppsManageUsersClient.getUserEmail = jest
        .fn()
        .mockResolvedValue({ username: 'johnSmith', email: 'johnsmith23904823492387@justice.gov.uk' } as UserEmail)
      hmppsManageUsersClient.getCaseloads = jest.fn().mockResolvedValue({ activeCaseload: 'KMI' } as CaseloadResponse)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('Foo Bar')
      expect(result.email).toEqual('johnsmith23904823492387@justice.gov.uk')
      expect(result.activeCaseLoadId).toEqual('KMI')
    })

    it('Retrieves and formats user name from delius', async () => {
      hmppsManageUsersClient.getUser = jest.fn().mockResolvedValue({
        username: 'FOOBAR',
        active: true,
        name: 'foo bar',
        authSource: 'delius',
        userId: '123456',
        uuid: '1a1a1a-1a1a1a1-1a1a1a1-1a1a1a1',
      } as User)
      hmppsManageUsersClient.getUserEmail = jest
        .fn()
        .mockResolvedValue({ username: 'johnSmith', email: 'johnsmith23904823492387@justice.gov.uk' } as UserEmail)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('Foo Bar')
      expect(result.email).toEqual('johnsmith23904823492387@justice.gov.uk')
      expect(result.activeCaseLoadId).toBeUndefined()
    })
    it('Propagates error', async () => {
      hmppsManageUsersClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
