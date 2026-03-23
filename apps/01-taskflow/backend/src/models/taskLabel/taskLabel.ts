import type { TaskLabelType } from "./types.js"

export class TaskLabel {
  public get labelId(): string {
    return this._labelId
  }
  public set labelId(value: string) {
    this._labelId = value
  }
  public get taskId(): string {
    return this._taskId
  }
  public set taskId(value: string) {
    this._taskId = value
  }

  private _labelId: string
  private _taskId: string

  constructor({ labelId, taskId }: TaskLabelType) {
    this._labelId = labelId
    this._taskId = taskId
  }
}