import * as z from "zod/mini"

export const CreateColumnSchema = z.object({
  boardId: z.uuid(),
  name: z.string().check(z.minLength(1)),
  position: z.number().check(z.nonnegative()),
})

export type CreateColumnDto = z.infer<typeof CreateColumnSchema>

export const UpdateColumnSchema = z.partial(CreateColumnSchema)

export type UpdateColumnDto = z.infer<typeof UpdateColumnSchema>
