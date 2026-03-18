import type { TaskType } from "#models/task/types.js"

import { Task } from "#models/task/task.js"

export class Story extends Task {
  constructor(data: Omit<TaskType, "type">) {
    super({
      ...data,
      type: "story",
    })
  }
}
