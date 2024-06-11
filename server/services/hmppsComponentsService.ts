import HmppsComponentsClient from '../data/hmppsComponentsClient'
import type { AvailableComponent, Component } from '../@types/hmppsFrontEndComponents'

export default class HmppsComponentsService {
  constructor(private readonly hmppsComponentsClient?: HmppsComponentsClient) {}

  async getComponents<T extends Array<AvailableComponent>>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    const hmppsComponentsClient = this.hmppsComponentsClient ?? new HmppsComponentsClient(userToken)

    return hmppsComponentsClient.getComponents(components)
  }
}
