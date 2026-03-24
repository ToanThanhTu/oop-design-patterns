export interface BoardType {
  createdAt: string
  id: string
  name: string
  updatedAt: string
}

export type CreateBoardDto = Omit<BoardType, "createdAt" | "id" | "updatedAt">
