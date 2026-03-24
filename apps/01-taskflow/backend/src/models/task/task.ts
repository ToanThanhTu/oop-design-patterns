import type { CreateTaskDto, PriorityType, TaskType, TaskTypeType } from "#models/task/types.js"
import type { Cloneable } from "#patterns/prototype/cloneable.js"

export class Task implements Cloneable<CreateTaskDto> {
  public get assignee(): null | string {
    return this._assignee
  }

  public set assignee(value: null | string) {
    this._assignee = value
  }

  public get columnId(): string {
    return this._columnId
  }

  public set columnId(value: string) {
    this._columnId = value
  }

  public get createdAt(): string {
    return this._createdAt
  }

  public set createdAt(value: string) {
    this._createdAt = value
  }

  public get description(): null | string {
    return this._description
  }

  public set description(value: null | string) {
    this._description = value
  }

  public get dueDate(): null | string {
    return this._dueDate
  }

  public set dueDate(value: null | string) {
    this._dueDate = value
  }

  public get id(): string {
    return this._id
  }

  public set id(value: string) {
    this._id = value
  }

  public get isTemplate(): boolean {
    return this._isTemplate
  }

  public set isTemplate(value: boolean) {
    this._isTemplate = value
  }

  public get position(): number {
    return this._position
  }

  public set position(value: number) {
    if (value < 0 || typeof value !== "number") {
      throw new Error(`Invalid position: ${value}`)
    }

    this._position = value
  }

  public get priority(): PriorityType {
    return this._priority
  }

  public set priority(value: PriorityType) {
    const valid: PriorityType[] = ["low", "medium", "high"]
    if (!valid.includes(value)) {
      throw new Error(`Invalid priority: ${value}`)
    }

    this._priority = value
  }

  public get title(): string {
    return this._title
  }

  public set title(value: string) {
    this._title = value
  }

  public get type(): TaskTypeType {
    return this._type
  }

  public set type(value: TaskTypeType) {
    const valid: TaskTypeType[] = ["bug", "feature", "story", "task"]
    if (!valid.includes(value)) {
      throw new Error(`Invalid type: ${value}`)
    }

    this._type = value
  }

  public get updatedAt(): string {
    return this._updatedAt
  }

  public set updatedAt(value: string) {
    this._updatedAt = value
  }

  protected _assignee: null | string
  protected _columnId: string
  protected _createdAt: string
  protected _description: null | string
  protected _dueDate: null | string
  protected _id: string
  protected _isTemplate: boolean
  protected _position: number
  protected _priority: PriorityType
  protected _title: string
  protected _type: TaskTypeType = "task"
  protected _updatedAt: string

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
    this._assignee = assignee
    this._columnId = columnId
    this._createdAt = createdAt
    this._description = description
    this._dueDate = dueDate
    this._id = id
    this._isTemplate = isTemplate
    this._position = position
    this._priority = priority
    this._title = title
    this._type = type
    this._updatedAt = updatedAt
  }

  public clone(): CreateTaskDto {
    return {
      assignee: this._assignee,
      columnId: this._columnId,
      description: this._description,
      dueDate: this._dueDate,
      isTemplate: false,
      position: this._position,
      priority: this._priority,
      title: this._title,
      type: this._type,
    }
  }

  toType(): TaskType {
    return {
      assignee: this._assignee,
      columnId: this._columnId,
      createdAt: this._createdAt,
      description: this._description,
      dueDate: this._dueDate,
      id: this._id,
      isTemplate: false,
      position: this._position,
      priority: this._priority,
      title: this._title,
      type: this._type,
      updatedAt: this._updatedAt,
    }
  }
}
