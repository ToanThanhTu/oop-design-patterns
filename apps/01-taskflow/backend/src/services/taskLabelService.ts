import type { TaskLabel } from "#models/taskLabel/taskLabel.js"
import type { TaskLabelType } from "#models/taskLabel/types.js"
import type { TaskLabelRepository } from "#repositories/taskLabelRepository.js"

export class TaskLabelService {
  private taskLabelRepository: TaskLabelRepository

  constructor(taskLabelRepository: TaskLabelRepository) {
    this.taskLabelRepository = taskLabelRepository
  }

  add(taskLabel: TaskLabelType): Promise<TaskLabel | undefined> {
    return this.taskLabelRepository.add(taskLabel)
  }

  getByLabelId(labelId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByLabelId(labelId)
  }

  getByTaskId(taskId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByTaskId(taskId)
  }

  remove(taskLabel: TaskLabelType): Promise<void> {
    return this.taskLabelRepository.remove(taskLabel)
  }
}