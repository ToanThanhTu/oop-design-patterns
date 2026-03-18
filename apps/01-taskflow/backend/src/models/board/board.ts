import type { BoardType } from "#models/board/types.js"

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
