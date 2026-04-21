import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '#shared/utils/errors.js'
import * as z from 'zod/mini'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.core.$ZodError) {
    res.status(400).json(err.issues)
  } else if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: { message: err.message } })
  } else {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
    })
  }
}
