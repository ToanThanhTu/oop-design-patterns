import type { ColumnType } from '#models/column/types.js'

export class Column {
  public get boardId(): string {
    return this._boardId
  }

  public set boardId(value: string) {
    this._boardId = value
  }

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

  public get position(): number {
    return this._position
  }

  public set position(value: number) {
    this._position = value
  }

  public get updatedAt(): string {
    return this._updatedAt
  }

  public set updatedAt(value: string) {
    this._updatedAt = value
  }

  private _boardId: string
  private _createdAt: string
  private _id: string
  private _name: string
  private _position: number
  private _updatedAt: string

  constructor({ boardId, createdAt, id, name, position, updatedAt }: ColumnType) {
    this._id = id
    this._name = name
    this._boardId = boardId
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._position = position
  }

  toJSON() {
    return this.toType()
  }

  toType(): ColumnType {
    return {
      boardId: this._boardId,
      createdAt: this._createdAt,
      id: this._id,
      name: this._name,
      position: this._position,
      updatedAt: this._updatedAt,
    }
  }
}
