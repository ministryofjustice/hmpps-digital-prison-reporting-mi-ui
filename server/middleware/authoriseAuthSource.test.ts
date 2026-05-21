import type { Request, Response } from 'express'
import { createMock } from '@golevelup/ts-jest'
import * as config from '../config'
import logger from '../../logger'
import authoriseAuthSource from './authoriseAuthSource'

jest.mock('../../logger')

describe('authoriseAuthSource', () => {
  const next = jest.fn()
  const layoutPath = '/path/to/layout.njk'

  beforeEach(() => {
    jest.resetAllMocks()
    config.default.requiredAuthSources = ['nomis']
  })

  const createResponse = (authSource?: string): Response =>
    createMock<Response>({
      locals: {
        user: authSource
          ? {
              username: 'USER1',
              authSource,
            }
          : undefined,
      },
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
    })

  it('allows a NOMIS user when the service requires NOMIS', () => {
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('nomis')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('allows a DELIUS user when the service requires DELIUS', () => {
    config.default.requiredAuthSources = ['delius']
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('delius')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('allows a DELIUS user when the service supports multiple sources including DELIUS', () => {
    config.default.requiredAuthSources = ['nomis', 'delius']
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('delius')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('blocks a DELIUS user when the service requires NOMIS', () => {
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('delius')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(
      {
        username: 'USER1',
        requiredAuthSources: ['nomis'],
        userAuthSource: 'delius',
        path: '/',
      },
      'User attempted to access service with the wrong auth source',
    )
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.render).toHaveBeenCalledWith('dpr/routes/authError.njk', {
      layoutPath,
      digitalPrisonServicesUrl: 'http://localhost:3000',
      userAuthSource: 'delius',
      requiredAuthSources: ['nomis'],
    })
  })

  it('blocks a NOMIS user when the service requires DELIUS', () => {
    config.default.requiredAuthSources = ['delius']
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('nomis')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.render).toHaveBeenCalledWith('dpr/routes/authError.njk', {
      layoutPath,
      digitalPrisonServicesUrl: 'http://localhost:3000',
      userAuthSource: 'nomis',
      requiredAuthSources: ['delius'],
    })
  })

  it('compares auth source case-insensitively', () => {
    const req = createMock<Request>({ originalUrl: '/' })
    const res = createResponse('NOMIS')

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('continues when there is no authenticated user', () => {
    const req = { originalUrl: '/health' } as Request
    const res = createResponse()

    authoriseAuthSource(layoutPath)(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
