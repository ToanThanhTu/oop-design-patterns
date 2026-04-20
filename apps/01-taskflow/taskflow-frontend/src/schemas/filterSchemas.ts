import { optionalFilterString } from '@/lib/formHelpers'
import { PrioritySchema, TaskTypeSchema } from '@/schemas/taskSchemas'
import * as z from 'zod/mini'

export const FilterSchema = z.object({
  assignee: optionalFilterString,
  dueDateFrom: optionalFilterString,
  dueDateTo: optionalFilterString,
  label: optionalFilterString,
  priority: z.catch(z.optional(PrioritySchema), undefined),
  type: z.catch(z.optional(TaskTypeSchema), undefined),
})

export type FilterType = z.infer<typeof FilterSchema>
