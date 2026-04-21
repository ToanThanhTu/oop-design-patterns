import type { PriorityType, TaskTypeType } from '#modules/tasks/task.schemas.js'

export interface TaskType {
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
