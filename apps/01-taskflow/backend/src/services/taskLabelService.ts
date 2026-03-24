import type { TaskLabel } from "#models/taskLabel/taskLabel.js"
import type { TaskLabelRepository } from "#repositories/taskLabelRepository.js"

export class TaskLabelService {
  private taskLabelRepository: TaskLabelRepository

  constructor(taskLabelRepository: TaskLabelRepository) {
    this.taskLabelRepository = taskLabelRepository
  }

  add(taskId: string, labelId: string): Promise<TaskLabel | undefined> {
    return this.taskLabelRepository.add(taskId, labelId)
  }

  getByLabelId(labelId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByLabelId(labelId)
  }

  getByTaskId(taskId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByTaskId(taskId)
  }

  remove(taskId: string, labelId: string): Promise<void> {
    return this.taskLabelRepository.remove(taskId, labelId)
  }
}