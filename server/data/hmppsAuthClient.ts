import superagent from 'superagent'
import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'
import generateOauthClientToken from '../authentication/clientCredentials'

const timeoutSpec = config.apis.hmppsAuth.timeout
const hmppsAuthUrl = config.apis.hmppsAuth.url

function getSystemClientTokenFromHmppsAuth(username?: string): Promise<superagent.Response> {
  const clientToken = generateOauthClientToken(
    config.apis.hmppsAuth.systemClientId,
    config.apis.hmppsAuth.systemClientSecret,
  )
  const grantRequest = new URLSearchParams({
    grant_type: 'client_credentials',
    ...(username && { username }),
  }).toString()

  logger.info(`${grantRequest} HMPPS Auth request for system client id '${config.apis.hmppsAuth.systemClientId}''`)

  return superagent
    .post(`${hmppsAuthUrl}${config.apis.hmppsAuth.tokenUri}`)
    .set('Authorization', clientToken)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(grantRequest)
    .timeout(timeoutSpec)
}

export interface User {
  name: string
  activeCaseLoadId: string
}

export interface UserRole {
  roleCode: string
}

export default class HmppsAuthClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Auth Client', config.apis.hmppsAuth, token)
  }

  getUser(token: string): Promise<User> {
    logger.info(`Getting user details: calling HMPPS Auth`)
    return HmppsAuthClient.restClient(token).get({ path: '/api/user/me' }) as Promise<User>
  }

  getUserRoles(token: string): Promise<string[]> {
    return HmppsAuthClient.restClient(token)
      .get({ path: '/api/user/me/roles' })
      .then(roles => (<UserRole[]>roles).map(role => role.roleCode))
  }

  async getSystemClientToken(username?: string): Promise<string> {
    const key = username || '%ANONYMOUS%'

    const newToken = await getSystemClientTokenFromHmppsAuth(username)

    return newToken.body.access_token
  }
}
