import type { Board } from '#modules/boards/board.model.js'
import type { CreateBoardDto, UpdateBoardDto } from '#modules/boards/board.schemas.js'

export interface BoardRepository {
  create(board: CreateBoardDto): Promise<Board | undefined>
  delete(id: string): Promise<void>
  findAll(): Promise<Board[]>
  findById(id: string): Promise<Board | undefined>
  update(boardId: string, board: UpdateBoardDto): Promise<Board | undefined>
}
