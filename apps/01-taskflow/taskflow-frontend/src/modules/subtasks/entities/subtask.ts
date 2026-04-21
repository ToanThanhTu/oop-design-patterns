export interface Subtask {
  id: string
  isComplete: boolean
  position: number
  taskId: string
  title: string
}

export interface CreateSubtaskDto {
  isComplete: boolean
  position: number
  taskId: string
  title: string
}

export type UpdateSubtaskDto = Partial<CreateSubtaskDto>
