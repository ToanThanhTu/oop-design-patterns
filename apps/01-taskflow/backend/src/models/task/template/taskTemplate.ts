import { Task } from "#models/task/task.js"

export abstract class TaskTemplate {
  abstract createDefault(columnId: string): Task
}
