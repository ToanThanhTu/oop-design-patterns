import * as z from 'zod/mini'

export const CreateSnapshotSchema = z.object({
  boardId: z.uuid(),
  description: z.nullable(z.string()),
  state: z.string(),
})

export type CreateSnapshotDto = z.infer<typeof CreateSnapshotSchema>
