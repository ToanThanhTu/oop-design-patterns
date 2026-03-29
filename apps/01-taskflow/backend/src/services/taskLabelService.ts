import type { TaskLabel } from '#models/taskLabel/taskLabel.js'
import type { TaskLabelRepository } from '#repositories/taskLabelRepository.js'
import type { AddTaskLabelDto, RemoveTaskLabelDto } from '#schemas/taskLabelSchemas.js'

export class TaskLabelService {
  private taskLabelRepository: TaskLabelRepository

  constructor(taskLabelRepository: TaskLabelRepository) {
    this.taskLabelRepository = taskLabelRepository
  }

  add(taskLabel: AddTaskLabelDto): Promise<TaskLabel | undefined> {
    return this.taskLabelRepository.add(taskLabel)
  }

  getByLabelId(labelId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByLabelId(labelId)
  }

  getByTaskId(taskId: string): Promise<TaskLabel[]> {
    return this.taskLabelRepository.findByTaskId(taskId)
  }

  remove(taskLabel: RemoveTaskLabelDto): Promise<void> {
    return this.taskLabelRepository.remove(taskLabel)
  }
}
