import type { TaskType } from "#models/task/types.js"

import { Task } from "#models/task/task.js"

export class Feature extends Task {
  constructor(data: Omit<TaskType, "type">) {
    super({
      ...data,
      type: "feature",
    })
  }
}
