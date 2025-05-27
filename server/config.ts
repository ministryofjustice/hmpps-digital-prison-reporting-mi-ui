import { report } from 'process'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

const apiCommonConfig = {
  timeout: {
    response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
    deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
  },
  agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
  apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
  apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
  systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
  systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
}

const automaticBookmarkConfig = {
  caseloads: {
    KMI: [
      { reportId: 'klefM94AAo2mXAsA_d0AISgWcQA', variantId: '140363.RS' },
      { reportId: 'FgOVB12wiAIA4WsAAHAbaV8RACJIABRd', variantId: '170509.RS' },
      { reportId: 'klmMGlYACRbiS7oA7.8AISgWcQA', variantId: '156265.RS' },
      { reportId: 'klZlXN0ADArqDoIA0f8AISgXYiw', variantId: '157660.RS' },
      { reportId: 'ok3fdNEAB7CFEmsAIT2D8K7BttM', variantId: '167273.RS' },
      { reportId: 'ok6qhnsABuK1cdQAR4WD8K7BT6k', variantId: '168720.RS' },
      { reportId: 'klXDSxkAAQbuAOMA6f8AISgXYiw', variantId: '157447.RS' },
      { reportId: 'Fs3G41xU4AgAi10AAHALtl8QACJIABRd', variantId: '170110.RS' },
      { reportId: 'klcQzv4ACdMcH4kBPs8AISgWcQA', variantId: '165912.RS' },
      { reportId: 'klekjOAAAyY5a9ABUf8AISgXYiw', variantId: '168360.RS' },
      { reportId: 'FntM0gDB4AoA09gQAADHiKAAACJIAGc1', variantId: '167273.RS' },
    ],
  },
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', '127.0.0.1', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false') === 'true',
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      ...apiCommonConfig,
    },
    manageUsers: {
      url: get('HMPPS_MANAGE_USERS_URL', 'http://localhost:9090/auth', requiredInProduction),
      ...apiCommonConfig,
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    reporting: {
      url: get('REPORTING_API_URL', 'http://127.0.0.1:3002', requiredInProduction),
      timeout: {
        response: Number(get('REPORTING_API_TIMEOUT_RESPONSE', 60000)),
        deadline: Number(get('REPORTING_API_TIMEOUT_DEADLINE', 60000)),
      },
      agent: new AgentConfig(Number(get('REPORTING_API_TIMEOUT_RESPONSE', 60000))),
    },
    frontendComponents: {
      url: get(
        'DPS_COMPONENT_API_URL',
        'https://frontend-components-dev.hmpps.service.justice.gov.uk',
        requiredInProduction,
      ),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  maintenanceMode: {
    enabled: Boolean(get('MAINTENANCE_MODE_ENABLED', 'false', requiredInProduction).toLowerCase() === 'true'),
    message: get('MAINTENANCE_MODE_MESSAGE', ''),
  },
  definitionPathsEnabled: Boolean(get('DEFINITION_PATHS_ENABLED', 'true', requiredInProduction) === 'true'),
  digitalPrisonServiceUrl: get('DPS_URL', 'http://localhost:3000', requiredInProduction),
  activeEstablishments: get('ACTIVE_ESTABLISHMENTS', '***', requiredInProduction).split(','),
  dpr: {
    routePrefix: get('DPR_ROUTE_PREFIX', 'dpr'),
    automaticBookmarkConfig,
  },
}
