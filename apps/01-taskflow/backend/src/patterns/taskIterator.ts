import type { Task } from "#models/task/task.js"
import type { TaskTypeType } from "#models/task/types.js"

interface FilterType {
  assignee?: string
  dueDateFrom?: string
  dueDateTo?: string
  label?: string
  priority?: string
  type?: TaskTypeType
}

export class TaskIterator implements Iterable<Task> {
  private filters: FilterType
  private tasks: Task[]

  constructor(tasks: Task[]) {
    this.tasks = tasks
    this.filters = {}
  }

  filterBy(filters: FilterType): this {
    this.filters = filters
    return this
  }

  *[Symbol.iterator](): Generator<Task> {
    for (const task of this.tasks) {
      if (this.matchesFilters(task)) {
        yield task
      }
    }
  }

  private matchesFilters(task: Task): boolean {
    if (this.filters.assignee && task.assignee !== this.filters.assignee) {
      return false
    }

    if (this.filters.priority && task.priority !== this.filters.priority) {
      return false
    }

    if (this.filters.type && task.type !== this.filters.type) {
      return false
    }

    const taskDueDate = task.dueDate

    if (this.filters.dueDateFrom || this.filters.dueDateTo) {
      if (!taskDueDate) {
        return false
      }

      if (this.filters.dueDateFrom && taskDueDate < this.filters.dueDateFrom) {
        return false
      }

      if (this.filters.dueDateTo && taskDueDate > this.filters.dueDateTo) {
        return false
      }
    }

    return true
  }
}
