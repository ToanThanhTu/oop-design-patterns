export type ActionError = {
  formError?: string
  fieldErrors?: Record<string, string>
}

export type ActionResult<T = never> = { ok: true; data?: T } | { ok: false; error: ActionError }

export type ZodIssueLike = {
  path: ReadonlyArray<string | number | symbol>
  message: string
}

export type ZodErrorLike = {
  issues: ReadonlyArray<ZodIssueLike>
}
