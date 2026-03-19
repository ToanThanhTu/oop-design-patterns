import type { BoardType } from "#models/board/types.js"

import { BoardSnapshot } from "#models/board/boardSnapshot.js"

export class Board {
  private createdAt: string
  private id: string
  private name: string
  private updatedAt: string

  constructor({ createdAt, id, name, updatedAt }: BoardType) {
    this.id = id ?? crypto.randomUUID()
    this.name = name
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? new Date().toISOString()
  }

  public createSnapshot(): BoardSnapshot {
    return new BoardSnapshot({
      createdAt: this.createdAt,
      id: this.id,
      name: this.name,
      updatedAt: this.updatedAt,
    })
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public restoreSnapshot(boardSnapshot: BoardSnapshot): void {
    const restored: BoardType = JSON.parse(boardSnapshot.getBoardState())

    this.id = restored.id!
    this.name = restored.name
    this.createdAt = restored.createdAt!
    this.updatedAt = restored.updatedAt!
  }

  public setCreatedAt(v: string) {
    this.createdAt = v
  }

  public setId(v: string) {
    this.id = v
  }

  public setName(v: string) {
    this.name = v
  }

  public setUpdatedAt(v: string) {
    this.updatedAt = v
  }
}
