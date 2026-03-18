import type { ColumnType } from "#models/column/types.js"

export class Column {
  private boardId: string
  private createdAt: string
  private id: string
  private name: string
  private position: number
  private updatedAt: string

  constructor({ boardId, createdAt, id, name, position, updatedAt }: ColumnType) {
    this.id = id ?? crypto.randomUUID()
    this.name = name
    this.boardId = boardId
    this.createdAt = createdAt ?? new Date().toISOString()
    this.updatedAt = updatedAt ?? new Date().toISOString()
    this.position = position
  }

  public getBoardId(): string {
    return this.boardId
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

  public getPosition(): number {
    return this.position
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public setBoardId(v: string) {
    this.boardId = v
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

  public setPosition(v: number) {
    this.position = v
  }

  public setUpdatedAt(v: string) {
    this.updatedAt = v
  }
}
