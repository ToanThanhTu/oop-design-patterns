import { checkbox, optionalDate, optionalString } from '@/shared/lib/formHelpers'
import * as z from 'zod/mini'

export const PrioritySchema = z.enum(['low', 'medium', 'high'])
export const TaskTypeSchema = z.enum(['bug', 'feature', 'story', 'task'])

export type PriorityType = z.infer<typeof PrioritySchema>
export type TaskTypeType = z.infer<typeof TaskTypeSchema>

export const CreateTaskSchema = z.object({
  assignee: optionalString,
  columnId: z.uuid(),
  description: optionalString,
  dueDate: optionalDate,
  isTemplate: checkbox,
  position: z.optional(z.number().check(z.nonnegative())),
  priority: PrioritySchema,
  title: z.string().check(z.minLength(1)),
  type: TaskTypeSchema,
})

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.partial(CreateTaskSchema)

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>

export const CloneTaskSchema = z.object({
  id: z.uuid(),
})

export type CloneTaskDto = z.infer<typeof CloneTaskSchema>