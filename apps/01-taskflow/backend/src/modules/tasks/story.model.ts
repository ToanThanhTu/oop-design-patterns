import type { TaskType } from '#modules/tasks/task.types.js'

import { Task } from '#modules/tasks/task.model.js'

export class Story extends Task {
  constructor(data: Omit<TaskType, 'type'>) {
    super({
      ...data,
      type: 'story',
    })
  }

  public clone(): Story {
    return new Story({
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
      updatedAt: this._updatedAt,
    })
  }
}
