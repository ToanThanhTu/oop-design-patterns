import type { CreateTaskDto } from "#schemas/taskSchemas.js";


export abstract class TaskTemplate {
  abstract createDefault(columnId: string): CreateTaskDto
}
