import { HttpError } from '@/lib/errors/httpError'
import type { ActionError } from '@/lib/errors/types'

export function toActionError(error: unknown): ActionError {
  if (error instanceof HttpError) {
    return {
      formError: error.message,
      fieldErrors: error.fieldErrors,
    }
  }
  if (error instanceof Error) {
    return { formError: error.message }
  }

  return { formError: 'An unexpected error occurred' }
}
