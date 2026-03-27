import type { CreateTaskDto } from "#schemas/taskSchemas.js"

import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class BugTemplate extends TaskTemplate {
  createDefault(columnId: string): CreateTaskDto {
    return {
      assignee: null,
      columnId,
      description: "Describe the bug, steps to reproduce, expected vs actual behavior",
      dueDate: null,
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Bug",
      type: 'bug'
    }
  }
}
