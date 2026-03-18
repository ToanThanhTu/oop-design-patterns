import { Bug } from "#models/task/bug.js"
import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class BugTemplate extends TaskTemplate {
  createDefault(columnId: string): Bug {
    return new Bug({
      columnId,
      description: "Describe the bug, steps to reproduce, expected vs actual behavior",
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Bug",
    })
  }
}
