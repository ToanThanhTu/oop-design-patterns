import type { BoardType } from "#models/board/types.js"

import { BoardSnapshot } from "#patterns/memento/boardSnapshot.js"

export class Board {
  public get createdAt(): string {
    return this._createdAt
  }

  public set createdAt(value: string) {
    this._createdAt = value
  }

  public get id(): string {
    return this._id
  }

  public set id(value: string) {
    this._id = value
  }

  public get name(): string {
    return this._name
  }

  public set name(value: string) {
    this._name = value
  }

  public get updatedAt(): string {
    return this._updatedAt
  }

  public set updatedAt(value: string) {
    this._updatedAt = value
  }

  private _createdAt: string
  private _id: string
  private _name: string
  private _updatedAt: string

  constructor({ createdAt, id, name, updatedAt }: BoardType) {
    this._id = id
    this._name = name
    this._createdAt = createdAt
    this._updatedAt = updatedAt
  }

  public createSnapshot(): BoardSnapshot {
    return new BoardSnapshot({
      createdAt: this._createdAt,
      id: this._id,
      name: this._name,
      updatedAt: this._updatedAt,
    })
  }

  public restoreSnapshot(boardSnapshot: BoardSnapshot): void {
    const restored: BoardType = JSON.parse(boardSnapshot.getBoardState())

    this._id = restored.id!
    this._name = restored.name
    this._createdAt = restored.createdAt!
    this._updatedAt = restored.updatedAt!
  }
}
