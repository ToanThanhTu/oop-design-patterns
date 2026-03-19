import type { TaskType } from "#models/task/types.js"

import { Task } from "#models/task/task.js"

export class Feature extends Task {
  constructor(data: Omit<TaskType, "type">) {
    super({
      ...data,
      type: "feature",
    })
  }

  public clone(): Feature {
    return new Feature({
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
