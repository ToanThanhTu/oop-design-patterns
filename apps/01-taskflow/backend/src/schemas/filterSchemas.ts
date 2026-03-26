import * as z from 'zod/mini'

import { TaskTypeSchema } from './taskSchemas.js'

export const FilterSchema = z.object({
  assignee: z.nullable(z.string()),
  dueDateFrom: z.nullable(z.string()),
  dueDateTo: z.nullable(z.string()),
  label: z.nullable(z.string()),
  priority: z.nullable(z.string()),
  type: z.nullable(TaskTypeSchema)
})

export type FilterType = z.infer<typeof FilterSchema>