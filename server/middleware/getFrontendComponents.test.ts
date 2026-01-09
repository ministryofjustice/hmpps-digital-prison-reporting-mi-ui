import type { DeepMocked } from '@golevelup/ts-jest'
import { createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'

import getFrontendComponents from './getFrontendComponents'
import logger from '../../logger'
import HmppsComponentsService from '../services/hmppsComponentsService'

jest.mock('../../logger')

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
    expect(next).toHaveBeenCalled()
  })

  it('calls next with an error when the components service throws an error', async () => {
    const error = new Error('SOME-ERROR')
    hmppsComponentsService.getComponents.mockRejectedValue(error)

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, res, next)

    expect(logger.error).toHaveBeenCalledWith(error, 'Failed to retrieve front end components')
    expect(next).toHaveBeenCalled()
  })

  it('does not fail when no user is set', async () => {
    const emptyRes = createMock<Response>({
      locals: {},
    })

    const req = createMock<Request>({})

    await getFrontendComponents(hmppsComponentsService)(req, emptyRes, next)

    expect(hmppsComponentsService.getComponents).toHaveBeenCalledTimes(0)
    expect(next).toHaveBeenCalled()
  })
})
