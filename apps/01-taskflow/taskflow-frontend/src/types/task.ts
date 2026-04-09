export type Priority = 'high' | 'low' | 'medium'
export type TaskType = 'bug' | 'feature' | 'story' | 'task'

export interface Task {
  assignee: null | string
  columnId: string
  createdAt: string
  description: null | string
  dueDate: null | string
  id: string
  isTemplate: boolean
  position: number
  priority: Priority
  title: string
  type: TaskType
  updatedAt: string
}

export interface CreateTaskDto {
  assignee: null | string
  columnId: string
  description: null | string
  dueDate: null | string
  isTemplate: boolean
  position: number
  priority: Priority
  title: string
  type: TaskType
}

export type UpdateTaskDto = Partial<CreateTaskDto>
