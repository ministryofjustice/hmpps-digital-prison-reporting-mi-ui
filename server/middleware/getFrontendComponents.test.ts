import type { DeepMocked } from '@golevelup/ts-jest'
import { createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'

import getFrontendComponents from './getFrontendComponents'
import logger from '../../logger'
import config from '../config'
import HmppsComponentsService from '../services/hmppsComponentsService'

jest.mock('../../logger')
jest.mock('../config', () => {
  const actual = jest.requireActual('../config')
  return { __esModule: true, default: { ...actual.default } }
})

describe('getFrontendComponents', () => {
  const userToken = 'SOME-USER-TOKEN'
  const hmppsComponentsService = createMock<HmppsComponentsService>({})

  const next = jest.fn()

  let res: DeepMocked<Response>

  beforeEach(() => {
    jest.resetAllMocks()

    res = createMock<Response>({
      locals: {
        user: {
          token: userToken,
        },
      },
    })
  })

  it('calls the components service correctly and populates the response locals with the correct values', async () => {
    const header = {
      css: ['header-css'],
      html: 'header-html',
      javascript: ['header-js'],
    }
    const footer = {
      css: ['footer-css'],
      html: 'footer-html',
      javascript: ['footer-js'],
    }

    hmppsComponentsService.getComponents.mockResolvedValue({ footer, header })

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, res, next)

    expect(hmppsComponentsService.getComponents).toHaveBeenCalledWith(['header', 'footer'], userToken)
    expect(res.locals.feComponents).toEqual({
      cssIncludes: ['header-css', 'footer-css'],
      footer: 'footer-html',
      header: 'header-html',
      jsIncludes: ['header-js', 'footer-js'],
      dpsUrl: 'http://localhost:3000',
    })
    expect(res.locals.scopeMoJGovInitToMain).toBe(false)
    expect(next).toHaveBeenCalled()
  })

  it('falls back to empty injected components when the components service throws', async () => {
    const error = new Error('SOME-ERROR')
    hmppsComponentsService.getComponents.mockRejectedValue(error)

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, res, next)

    expect(logger.error).toHaveBeenCalledWith(error, 'Failed to retrieve front end components')
    expect(res.locals.feComponents).toEqual({
      cssIncludes: [],
      footer: '',
      header: '',
      jsIncludes: [],
      dpsUrl: 'http://localhost:3000',
    })
    expect(res.locals.scopeMoJGovInitToMain).toBe(false)
    expect(next).toHaveBeenCalled()
  })

  it('sets scopeMoJGovInitToMain to true when isProbationService and header is non-empty', async () => {
    config.isProbationService = true

    const header = {
      css: ['header-css'],
      html: '<div data-module="pds-header">PDS</div>',
      javascript: ['header-js'],
    }
    const footer = {
      css: ['footer-css'],
      html: 'footer-html',
      javascript: ['footer-js'],
    }

    hmppsComponentsService.getComponents.mockResolvedValue({ footer, header })

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, res, next)

    expect(res.locals.scopeMoJGovInitToMain).toBe(true)
    expect(next).toHaveBeenCalled()

    config.isProbationService = false
  })

  it('does not fail when no user is set', async () => {
    const emptyRes = createMock<Response>({
      locals: {},
    })

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, emptyRes, next)

    expect(hmppsComponentsService.getComponents).toHaveBeenCalledTimes(0)
    expect(emptyRes.locals.scopeMoJGovInitToMain).toBe(false)
    expect(next).toHaveBeenCalled()
  })
})
