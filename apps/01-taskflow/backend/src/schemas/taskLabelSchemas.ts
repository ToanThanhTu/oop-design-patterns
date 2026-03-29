import * as z from 'zod/mini'

export const AddTaskLabelSchema = z.object({
  labelId: z.uuid(),
  taskId: z.uuid(),
})

export type AddTaskLabelDto = z.infer<typeof AddTaskLabelSchema>

export const RemoveTaskLabelSchema = z.object({
  labelId: z.uuid(),
  taskId: z.uuid(),
})

export type RemoveTaskLabelDto = z.infer<typeof RemoveTaskLabelSchema>
