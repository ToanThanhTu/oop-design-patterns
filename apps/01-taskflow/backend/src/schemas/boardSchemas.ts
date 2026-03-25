import * as z from "zod/mini"

export const CreateBoardSchema = z.object({
  name: z.string().check(z.minLength(1)),
})

export type CreateBoardDto = z.infer<typeof CreateBoardSchema>

export const UpdateBoardSchema = z.partial(CreateBoardSchema)

export type UpdateBoardDto = z.infer<typeof UpdateBoardSchema>
