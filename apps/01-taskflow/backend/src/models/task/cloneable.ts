import type { Task } from "#models/task/task.js"

export interface Cloneable {
  clone(): Task
}
