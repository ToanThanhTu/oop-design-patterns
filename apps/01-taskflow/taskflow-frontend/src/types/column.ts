export interface Column {
  boardId: string
  createdAt: string
  id: string
  name: string
  position: number
  updatedAt: string
}

export interface CreateColumnDto {
  boardId: string
  name: string
  position: number
}

export type UpdateColumnDto = Partial<CreateColumnDto>
