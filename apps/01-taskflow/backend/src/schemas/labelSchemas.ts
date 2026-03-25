import * as z from "zod/mini"

export const CreateLabelSchema = z.object({
  color: z.string(),
  name: z.string().check(z.minLength(1)),
})

export type CreateLabelDto = z.infer<typeof CreateLabelSchema>

export const UpdateLabelSchema = z.partial(CreateLabelSchema)

export type UpdateLabelDto = z.infer<typeof UpdateLabelSchema>
