import nock from 'nock'

import HmppsComponentsClient from './hmppsComponentsClient'
import config from '../config'
import type { Component } from '../@types/hmppsFrontEndComponents'

describe('hmppsComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let hmppsComponentsClient: HmppsComponentsClient
  const token = 'token-1'

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.frontendComponents.url)
    hmppsComponentsClient = new HmppsComponentsClient(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should return data from api', async () => {
      const response: { data: { footer: Component; header: Component } } = {
        data: {
          footer: {
            css: [],
            html: '<footer></footer>',
            javascript: [],
          },
          header: {
            css: [],
            html: '<header></header>',
            javascript: [],
          },
        },
      }

      fakeComponentsApi
        .get('/components?component=header&component=footer')
        .matchHeader('x-user-token', token)
        .reply(200, response)

      const output = await hmppsComponentsClient.getComponents(['header', 'footer'])
      expect(output).toEqual(response)
    })
  })
})
