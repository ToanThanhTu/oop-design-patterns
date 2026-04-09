import type { ActionError, ZodErrorLike } from '@/lib/errors/types'

export function zodErrorToActionError(zodError: ZodErrorLike): ActionError {
  const fieldErrors: Record<string, string> = {}
  const formErrors: string[] = []

  for (const issue of zodError.issues) {
    if (issue.path.length === 0) {
      formErrors.push(issue.message)
    } else {
      const key = issue.path.join('.')

      if (!(key in fieldErrors)) {
        fieldErrors[key] = issue.message
      }
    }
  }

  return {
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    formError: formErrors.length > 0 ? formErrors[0] : undefined,
  }
}
