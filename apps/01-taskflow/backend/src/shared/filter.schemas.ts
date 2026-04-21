import * as z from 'zod/mini'

import { PrioritySchema, TaskTypeSchema } from '#modules/tasks/task.schemas.js'

export const FilterSchema = z.partial(
  z.object({
    assignee: z.nullable(z.string()),
    dueDateFrom: z.nullable(z.string()),
    dueDateTo: z.nullable(z.string()),
    label: z.nullable(z.string()),
    priority: z.nullable(PrioritySchema),
    type: z.nullable(TaskTypeSchema),
  }),
)

export type FilterType = z.infer<typeof FilterSchema>
