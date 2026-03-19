import type { TaskType } from "#models/task/types.js"

import { Task } from "#models/task/task.js"

export class Story extends Task {
  constructor(data: Omit<TaskType, "type">) {
    super({
      ...data,
      type: "story",
    })
  }

  public clone(): Story {
    return new Story({
      assignee: this.assignee,
      columnId: this.columnId,
      description: this.description,
      dueDate: this.dueDate,
      isTemplate: false,
      position: this.position,
      priority: this.priority,
      title: this.title,
    })
  }
}
