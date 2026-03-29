import * as z from 'zod/mini'

export const PrioritySchema = z.enum(['low', 'medium', 'high'])
export const TaskTypeSchema = z.enum(['bug', 'feature', 'story', 'task'])

export type PriorityType = z.infer<typeof PrioritySchema>
export type TaskTypeType = z.infer<typeof TaskTypeSchema>

export const CreateTaskSchema = z.object({
  assignee: z.nullable(z.string()),
  columnId: z.uuid(),
  description: z.nullable(z.string()),
  dueDate: z.nullable(z.iso.datetime()),
  isTemplate: z.boolean(),
  position: z.number().check(z.nonnegative()),
  priority: PrioritySchema,
  title: z.string().check(z.minLength(1)),
  type: TaskTypeSchema,
})

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.partial(CreateTaskSchema)

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>
