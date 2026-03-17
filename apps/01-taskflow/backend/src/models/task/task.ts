import type { PriorityType, TaskType, TaskTypeType } from "#models/task/types.js"

export class Task {
  private assignee: null | string
  private columnId: string
  private createdAt: string
  private description: null | string
  private dueDate: null | string
  private id: string
  private isTemplate: boolean
  private position: number
  private priority: PriorityType
  private title: string
  private type: TaskTypeType = "task"
  private updatedAt: string

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
    this.createdAt = createdAt
    this.description = description ?? null
    this.dueDate = dueDate ?? null
    this.id = id
    this.isTemplate = isTemplate
    this.position = position
    this.priority = priority
    this.title = title
    this.type = type
    this.updatedAt = updatedAt
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
    this.position = v
  }

  public setPriority(v: PriorityType) {
    this.priority = v
  }

  public setTitle(v: string) {
    this.title = v
  }

  public setType(v: TaskTypeType) {
    this.type = v
  }

  public setUpdatedAt(v: string) {
    this.updatedAt = v
  }
}
