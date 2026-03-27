import type { CreateTaskDto } from "#schemas/taskSchemas.js"

import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class StoryTemplate extends TaskTemplate {
  createDefault(columnId: string): CreateTaskDto {
    return {
      assignee: null,
      columnId,
      description: "Describe the story",
      dueDate: null,
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Story",
      type: 'story'
    }
  }
}
