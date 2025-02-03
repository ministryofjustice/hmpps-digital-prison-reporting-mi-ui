import nock from 'nock'

import config from '../config'
import HmppsManageUsersClient from './hmppsManageUsersClient'

const token = { access_token: 'token-1', expires_in: 300 }

describe('hmppsManageUsersClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let hmppsManageUsersClient: HmppsManageUsersClient

  beforeEach(() => {
    fakeHmppsAuthApi = nock(config.apis.hmppsAuth.url)
    hmppsManageUsersClient = new HmppsManageUsersClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getUser', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakeHmppsAuthApi
        .get('/users/me')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await hmppsManageUsersClient.getUser(token.access_token)
      expect(output).toEqual(response)
    })
  })
})
