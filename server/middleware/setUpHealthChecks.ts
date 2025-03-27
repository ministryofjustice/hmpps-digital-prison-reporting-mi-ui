import express, { Router } from 'express'

import healthcheck from '../services/healthCheck'

export default function setUpHealthChecks(): Router {
  const router = express.Router()

  router.get('/health', (req, res, next) => {
    healthcheck(result => {
      if (!result.healthy) {
        res.status(503)
      }
      res.json(result)
    })
  })

  // @ts-expect-error Return
  router.get('/ping', (req, res) =>
    res.send({
      status: 'UP',
    }),
  )

  return router
}
