import type { BoardStateType } from "#patterns/memento/types.js"

export class BoardSnapshot {
  private readonly boardState: string

  constructor(board: BoardStateType) {
    this.boardState = JSON.stringify(board)
  }

  getBoardState(): string {
    return this.boardState
  }
}
