import * as z from "zod/mini"

export const CreateBoardSchema = z.object({
  name: z.string().check(z.minLength(1)),
})

export const UpdateBoardSchema = z.object({
  name: z.string().check(z.minLength(1)),
})