import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import logger from '../utils/logger'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({
    message: 'Error occurred',
    endpoint: req.originalUrl,
    method: req.method,
    payload: req.body,
    error: err instanceof Error ? err.message : 'Unknown error',
  })

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: Array.isArray(e.path) ? e.path.join('.') : e.path,
      message: e.message,
    }))

    res.status(400).json({
      error: 'Validation error',
      details: formattedErrors,
    })
    return
  }

  res.status(500).json({
    error: 'Internal server error',
    message: err instanceof Error ? err.message : 'Unknown error',
  })
}

export default errorHandler
