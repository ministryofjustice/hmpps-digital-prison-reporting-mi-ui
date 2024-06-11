import HmppsComponentsService from './hmppsComponentsService'
import HmppsComponentsClient from '../data/hmppsComponentsClient'
import type { AvailableComponent, Component } from '../@types/hmppsFrontEndComponents'

jest.mock('../data/hmppsComponentsClient')

describe('hmppsComponentsService', () => {
  const userToken = 'SOME-USER-TOKEN'
  const components: Array<AvailableComponent> = ['footer', 'header']

  const hmppsComponentsClient = new HmppsComponentsClient(userToken) as jest.Mocked<HmppsComponentsClient>

  const service = new HmppsComponentsService(hmppsComponentsClient)

  describe('getComponents', () => {
    it('should call the hmppsComponentsClient correctly and return the response', async () => {
      const response: Record<string, Component> = {
        footer: {
          css: ['some-css'],
          html: 'some-html',
          javascript: ['some-javascript'],
        },
        header: {
          css: ['some-css'],
          html: 'some-html',
          javascript: ['some-javascript'],
        },
      }

      hmppsComponentsClient.getComponents.mockResolvedValue(response)

      const result = await service.getComponents(components, userToken)

      expect(result).toEqual(response)
      expect(hmppsComponentsClient.getComponents).toHaveBeenCalledWith(components)
    })
  })
})
