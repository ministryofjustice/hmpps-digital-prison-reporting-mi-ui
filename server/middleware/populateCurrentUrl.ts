import { RequestHandler } from 'express'

export default (): RequestHandler => {
  return (req, res, next) => {
    res.locals.currentUrl = req.originalUrl
    next()
  }
}
