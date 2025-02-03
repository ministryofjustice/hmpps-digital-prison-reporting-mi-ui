import { Response } from 'superagent'

import { stubFor } from './wiremock'

const stubUser = (name: string) =>
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

export default {
  stubAuthUser: (name = 'john smith'): Promise<[Response, Response]> => Promise.all([stubUser(name), stubUserEmail()]),
}
