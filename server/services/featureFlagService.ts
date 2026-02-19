import {
  BooleanEvaluationResponse,
  EvaluationRequest,
  FlagType,
  FliptClient,
  ListFlagsResponse,
  VariantEvaluationResponse,
} from '@flipt-io/flipt'
import { Application } from 'express'

export interface FeatureFlagConfig {
  namespace: string
  token: string
  url: string
}

type FlagTypeEvaluationResponseMap = {
  [K in FlagType]: K extends 'BOOLEAN_FLAG_TYPE'
    ? BooleanEvaluationResponse
    : K extends 'VARIANT_FLAG_TYPE'
      ? VariantEvaluationResponse
      : never
}

export class AppFeatureFlagService {
  restClient: FliptClient | undefined

  namespace: string | undefined

  enabled: boolean = false

  constructor(config: FeatureFlagConfig | Record<string, unknown> = {}) {
    const { namespace, token, url } = config && (config as FeatureFlagConfig)
    if (Object.keys(config).length !== 3 || !namespace || !token || !url) {
      return
    }
    this.restClient = new FliptClient({
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      url,
    })
    this.enabled = true
    this.namespace = namespace
  }

  async getFlags(): Promise<ListFlagsResponse> {
    if (!this.restClient || !this.namespace) {
      return {
        flags: [],
        nextPageToken: '',
        totalCount: 0,
      }
    }
    return this.restClient.flags.listFlags(this.namespace)
  }

  async evaluateFlag(flagKey: string, flagType: 'BOOLEAN_FLAG_TYPE'): Promise<BooleanEvaluationResponse>

  async evaluateFlag(flagKey: string, flagType: 'VARIANT_FLAG_TYPE'): Promise<VariantEvaluationResponse>

  async evaluateFlag(flagKey: string, flagType: FlagType): Promise<FlagTypeEvaluationResponseMap[FlagType]> {
    if (!this.restClient) {
      return {
        enabled: false,
        flagKey: '',
        reason: 'UNKNOWN_EVALUATION_REASON',
        requestDurationMillis: 0,
        segmentKeys: [],
        timestamp: '',
      } satisfies BooleanEvaluationResponse
    }
    const evaluationConfig = {
      flagKey,
      namespaceKey: this.namespace,
      entityId: '',
      context: {},
    } satisfies EvaluationRequest
    switch (flagType) {
      case 'BOOLEAN_FLAG_TYPE': {
        return this.restClient.evaluation.boolean(evaluationConfig)
      }
      case 'VARIANT_FLAG_TYPE': {
        return this.restClient.evaluation.variant(evaluationConfig)
      }
      default:
        throw Error('Invalid feature flag type provided')
    }
  }
}

export const isBooleanFlagEnabled = (flagName: string, app: Application): boolean => {
  const flag = app.locals.featureFlags?.flags?.[flagName]
  if (flag && flag.type !== 'BOOLEAN_FLAG_TYPE') {
    throw Error('Tried to validate whether a non-boolean flag was enabled')
  }
  return !flag || flag.enabled
}
