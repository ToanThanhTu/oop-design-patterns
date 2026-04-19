import * as z from 'zod/mini'

export const optionalString = z.pipe(
  z.transform((v: unknown) => (v === '' ? null : v)),
  z.nullable(z.string()),
)

export const optionalDate = z.pipe(
  z.transform((v: unknown) => (v === '' ? null : v)),
  z.nullable(z.iso.date()),
)

export const checkbox = z.pipe(
  z.transform((v: unknown) => v === 'on' || v === true),
  z.boolean(),
)
