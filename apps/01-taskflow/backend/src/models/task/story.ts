import type { TaskType } from "#models/task/types.js"

import { Task } from "#models/task/task.js"

export class Story extends Task {
  constructor({
    assignee,
    columnId,
    createdAt,
    description,
    dueDate,
    id,
    isTemplate,
    position,
    priority,
    title,
    updatedAt,
  }: TaskType) {
    super({
      assignee: assignee ?? null,
      columnId,
      createdAt,
      description: description ?? null,
      dueDate: dueDate ?? null,
      id,
      isTemplate,
      position,
      priority,
      title,
      type: "story",
      updatedAt,
    })
  }
}
