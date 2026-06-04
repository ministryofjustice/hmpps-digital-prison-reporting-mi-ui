import { Response } from 'superagent'

import { stubFor } from './wiremock'

type AuthSource = 'nomis' | 'delius'

type StubAuthUserOptions = {
  name?: string
  authSource?: AuthSource
}

const stubUser = (name: string, authSource: AuthSource) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        staffId: 231232,
        username: 'USER1',
        active: true,
        name,
        authSource,
        userId: 'USER1',
        uuid: 'user-uuid',
      },
    },
  })

const stubUserEmail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/users/me/email',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [{ email: 'test@user.com' }],
    },
  })

const stubUserCaseloads = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/users/me/caseloads',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username: 'USER1',
        active: true,
        accountType: 'GENERAL',
        activeCaseload: 'KMI',
        caseloads: [
          {
            id: 'KMI',
            name: 'KMI',
            function: 'SOMEFUNC',
          },
        ],
      },
    },
  })

export default {
  stubAuthUser: (options: string | StubAuthUserOptions = 'john smith'): Promise<[Response, Response, Response]> => {
    const name = typeof options === 'string' ? options : options.name || 'john smith'
    const authSource = typeof options === 'string' ? 'nomis' : options.authSource || 'nomis'
    return Promise.all([stubUser(name, authSource), stubUserEmail(), stubUserCaseloads()])
  },
}
