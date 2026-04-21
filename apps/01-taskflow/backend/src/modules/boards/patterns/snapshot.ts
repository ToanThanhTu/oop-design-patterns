import type { BoardStateType } from '#modules/boards/patterns/types.js'

export class BoardSnapshot {
  private readonly boardState: string

  constructor(board: BoardStateType) {
    this.boardState = JSON.stringify(board)
  }

  getBoardState(): string {
    return this.boardState
  }
}
