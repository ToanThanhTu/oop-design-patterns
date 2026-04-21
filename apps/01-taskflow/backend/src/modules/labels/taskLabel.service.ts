import type { TaskLabel } from '#modules/labels/taskLabel.model.js'
import type { TaskLabelRepository } from '#modules/labels/taskLabel.repository.js'
import type { AddTaskLabelDto, RemoveTaskLabelDto } from '#modules/labels/taskLabel.schemas.js'

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
