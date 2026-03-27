import type { CreateTaskDto } from "#schemas/taskSchemas.js"

import { TaskTemplate } from "#models/task/template/taskTemplate.js"

export class FeatureTemplate extends TaskTemplate {
  createDefault(columnId: string): CreateTaskDto {
    return {
      assignee: null,
      columnId,
      description: "Describe the feature, with expected behavior",
      dueDate: null,
      isTemplate: true,
      position: 0,
      priority: "high",
      title: "New Feature",
      type: 'feature',
    }
  }
}
