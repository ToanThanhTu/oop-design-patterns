import type { PriorityType, TaskTypeType } from '@/modules/tasks/schemas'

export interface Task {
  assignee: null | string
  columnId: string
  createdAt: string
  description: null | string
  dueDate: null | string
  id: string
  isTemplate: boolean
  position: number
  priority: PriorityType
  title: string
  type: TaskTypeType
  updatedAt: string
}
