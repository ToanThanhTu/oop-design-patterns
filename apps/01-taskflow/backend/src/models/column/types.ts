export type CreateColumnDto = Omit<ColumnType, "createdAt" | "id" | "updatedAt">

export interface ColumnType {
  boardId: string
  createdAt: string
  id: string
  name: string
  position: number
  updatedAt: string
}
