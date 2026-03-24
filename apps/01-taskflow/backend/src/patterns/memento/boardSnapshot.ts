import type { BoardType } from "#models/board/types.js"

export class BoardSnapshot {
  private readonly boardState: string

  constructor(board: BoardType) {
    this.boardState = JSON.stringify(board)
  }

  getBoardState(): string {
    return this.boardState
  }
}
