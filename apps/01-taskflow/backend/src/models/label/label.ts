import type { LabelType } from './types.js'

export class Label {
  public get color(): string {
    return this._color
  }

  public set color(value: string) {
    this._color = value
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

  private _color: string
  private _id: string
  private _name: string

  constructor({ color, id, name }: LabelType) {
    this._id = id
    this._color = color
    this._name = name
  }

  toJSON() {
    return this.toType()
  }

  toType(): LabelType {
    return {
      color: this._color,
      id: this._id,
      name: this._name,
    }
  }
}
