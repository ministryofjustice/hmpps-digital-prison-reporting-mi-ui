import {
  FliptClient,
  type ClientOptions,
  type BooleanEvaluationResponse,
  type VariantEvaluationResponse,
} from '@flipt-io/flipt-client-js/node'

export interface FeatureFlagConfig {
  namespace: string
  token: string
  url: string
}

type FlagType = 'BOOLEAN_FLAG_TYPE' | 'VARIANT_FLAG_TYPE'

type FlagTypeEvaluationResponseMap = {
  BOOLEAN_FLAG_TYPE: BooleanEvaluationResponse
  VARIANT_FLAG_TYPE: VariantEvaluationResponse
}

export class AppFeatureFlagService {
  private readonly clientConfig: ClientOptions | undefined

  private clientPromise: Promise<FliptClient> | undefined

  enabled: boolean = false

  constructor(config: FeatureFlagConfig | Record<string, unknown> = {}) {
    const { namespace, token, url } = config && (config as FeatureFlagConfig)

    if (!namespace || !token || !url) {
      return
    }

    this.clientConfig = {
      url,
      namespace,
      authentication: {
        clientToken: token,
      },
    }
    this.enabled = true
  }

  private async getClient(): Promise<FliptClient | undefined> {
    if (!this.clientConfig) {
      return undefined
    }

    if (!this.clientPromise) {
      this.clientPromise = FliptClient.init(this.clientConfig).catch((error: unknown) => {
        this.clientPromise = undefined
        throw error
      })
    }

    return this.clientPromise
  }

  async refresh() {
    const client = await this.getClient()
    await client?.refresh()
  }

  async evaluateFlag(flagKey: string, flagType: 'BOOLEAN_FLAG_TYPE'): Promise<BooleanEvaluationResponse>

  async evaluateFlag(flagKey: string, flagType: 'VARIANT_FLAG_TYPE'): Promise<VariantEvaluationResponse>

  async evaluateFlag<T extends FlagType>(flagKey: string, flagType: T): Promise<FlagTypeEvaluationResponseMap[T]> {
    const client = await this.getClient().catch((): undefined => undefined)

    if (!client) {
      return {
        enabled: false,
        flagKey: '',
        reason: 'UNKNOWN_EVALUATION_REASON',
        requestDurationMillis: 0,
        segmentKeys: [],
        timestamp: '',
      } satisfies BooleanEvaluationResponse as FlagTypeEvaluationResponseMap[T]
    }

    const evaluationRequest = {
      flagKey,
      entityId: '',
      context: {},
    }

    switch (flagType) {
      case 'BOOLEAN_FLAG_TYPE': {
        return client.evaluateBoolean(evaluationRequest) as FlagTypeEvaluationResponseMap[T]
      }
      case 'VARIANT_FLAG_TYPE': {
        return client.evaluateVariant(evaluationRequest) as FlagTypeEvaluationResponseMap[T]
      }
      default:
        throw Error('Invalid feature flag type provided')
    }
  }
}
