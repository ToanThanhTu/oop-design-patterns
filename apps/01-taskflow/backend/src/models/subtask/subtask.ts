import type { SubtaskType } from './types.js'

export class Subtask {
  public get id(): string {
    return this._id
  }

  public set id(value: string) {
    this._id = value
  }

  public get isComplete(): boolean {
    return this._isComplete
  }

  public set isComplete(value: boolean) {
    this._isComplete = value
  }

  public get position(): number {
    return this._position
  }

  public set position(value: number) {
    this._position = value
  }

  public get taskId(): string {
    return this._taskId
  }

  public set taskId(value: string) {
    this._taskId = value
  }

  public get title(): string {
    return this._title
  }

  public set title(value: string) {
    this._title = value
  }

  private _id: string
  private _isComplete: boolean
  private _position: number
  private _taskId: string
  private _title: string

  constructor({ id, isComplete, position, taskId, title }: SubtaskType) {
    this._id = id
    this._isComplete = isComplete
    this._taskId = taskId
    this._position = position
    this._title = title
  }

  toJSON() {
    return this.toType()
  }

  toType(): SubtaskType {
    return {
      id: this._id,
      isComplete: this._isComplete,
      position: this._position,
      taskId: this._taskId,
      title: this._title,
    }
  }
}
