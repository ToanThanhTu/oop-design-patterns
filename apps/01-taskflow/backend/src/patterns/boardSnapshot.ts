import type { BoardType } from "#models/board/types.js"

type BoardStateType = string

export class BoardSnapshot {
  private readonly boardState: BoardStateType

  constructor(board: BoardType) {
    this.boardState = JSON.stringify(board)
  }

  getBoardState(): BoardStateType {
    return this.boardState
  }
}
