import type { PriorityType, TaskType, TaskTypeType } from "#models/task/types.js"
import type { Cloneable } from "#patterns/cloneable.js"

export class Task implements Cloneable {
  protected assignee: null | string
  protected columnId: string
  protected createdAt: string
  protected description: null | string
  protected dueDate: null | string
  protected id: string
  protected isTemplate: boolean
  protected position: number
  protected priority: PriorityType
  protected title: string
  protected type: TaskTypeType = "task"
  protected updatedAt: string

  constructor({
    assignee,
    columnId,
    createdAt,
    description,
    dueDate,
    id,
    isTemplate,
    position,
    priority,
    title,
    type,
    updatedAt,
  }: TaskType) {
    this.assignee = assignee ?? null
    this.columnId = columnId
    this.createdAt = createdAt ?? new Date().toISOString()
    this.description = description ?? null
    this.dueDate = dueDate ?? null
    this.id = id ?? crypto.randomUUID()
    this.isTemplate = isTemplate
    this.position = position
    this.priority = priority
    this.title = title
    this.type = type
    this.updatedAt = updatedAt ?? new Date().toISOString()
  }

  public clone() {
    return new Task({
      assignee: this.assignee,
      columnId: this.columnId,
      description: this.description,
      dueDate: this.dueDate,
      isTemplate: false,
      position: this.position,
      priority: this.priority,
      title: this.title,
      type: this.type,
    })
  }

  public getAssignee(): null | string {
    return this.assignee
  }

  public getColumnId(): string {
    return this.columnId
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  public getDescription(): null | string {
    return this.description
  }

  public getDueDate(): null | string {
    return this.dueDate
  }

  public getId(): string {
    return this.id
  }

  public getIsTemplate(): boolean {
    return this.isTemplate
  }

  public getPosition(): number {
    return this.position
  }

  public getPriority(): PriorityType {
    return this.priority
  }

  public getTitle(): string {
    return this.title
  }

  public getType(): string {
    return this.type
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public setAssignee(v: null | string) {
    this.assignee = v
  }

  public setColumnId(v: string) {
    this.columnId = v
  }

  public setCreatedAt(v: string) {
    this.createdAt = v
  }

  public setDescription(v: null | string) {
    this.description = v
  }

  public setDueDate(v: null | string) {
    this.dueDate = v
  }

  public setId(v: string) {
    this.id = v
  }

  public setIsTemplate(v: boolean) {
    this.isTemplate = v
  }

  public setPosition(v: number) {
    if (v < 0 || typeof v !== "number") {
      throw new Error(`Invalid position: ${v}`)
    }

    this.position = v
  }

  public setPriority(v: PriorityType) {
    const valid: PriorityType[] = ["low", "medium", "high"]
    if (!valid.includes(v)) {
      throw new Error(`Invalid priority: ${v}`)
    }

    this.priority = v
  }

  public setTitle(v: string) {
    this.title = v
  }

  public setType(v: TaskTypeType) {
    const valid: TaskTypeType[] = ["bug", "feature", "story", "task"]
    if (!valid.includes(v)) {
      throw new Error(`Invalid type: ${v}`)
    }

    this.type = v
  }

  public setUpdatedAt(v: string) {
    this.updatedAt = v
  }
}
