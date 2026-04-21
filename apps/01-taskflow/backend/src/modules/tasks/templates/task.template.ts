import type { CreateTaskDto } from '#modules/tasks/task.schemas.js'

export abstract class TaskTemplate {
  abstract createDefault(columnId: string): CreateTaskDto
}
