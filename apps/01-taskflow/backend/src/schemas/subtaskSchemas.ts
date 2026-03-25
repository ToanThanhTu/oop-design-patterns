import * as z from "zod/mini"

export const CreateSubtaskSchema = z.object({
  isComplete: z.boolean(),
  position: z.number().check(z.nonnegative()),
  taskId: z.uuid(),
  title: z.string().check(z.minLength(1)),
})

export type CreateSubtaskDto = z.infer<typeof CreateSubtaskSchema>

export const UpdateSubtaskSchema = z.partial(CreateSubtaskSchema)

export type UpdateSubtaskDto = z.infer<typeof UpdateSubtaskSchema>
