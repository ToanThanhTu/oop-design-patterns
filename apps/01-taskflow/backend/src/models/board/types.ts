export type CreateBoardDto = Omit<BoardType, "createdAt" | "id" | "updatedAt">

export interface BoardType {
  createdAt: string
  id: string
  name: string
  updatedAt: string
}
