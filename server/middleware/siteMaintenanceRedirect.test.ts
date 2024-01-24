import type { Request, Response } from 'express'
import * as config from '../config'

import siteMaintenanceRedirect from './siteMaintenanceRedirect'

describe('siteMaintenanceRedirect', () => {
  const next = jest.fn()

  function createReqWithOriginalURl(originalUrl: string): Request {
    return {
      originalUrl,
      path: originalUrl,
    } as unknown as Request
  }

  function createRes(): Response {
    return {
      redirect: jest.fn(),
    } as unknown as Response
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should not redirect to the maintenance screen', async () => {
    config.default.maintenanceMode = false
    const req = createReqWithOriginalURl('/reports')
    const res = createRes()

    await siteMaintenanceRedirect()(req, res, next)

    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to the maintenance screen', async () => {
    config.default.maintenanceMode = true
    const req = createReqWithOriginalURl('/reports')
    const res = createRes()

    await siteMaintenanceRedirect()(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/maintenance')
  })
})
