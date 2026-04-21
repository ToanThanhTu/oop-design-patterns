import type { TaskLabel } from '#modules/labels/taskLabel.model.js'
import type { AddTaskLabelDto, RemoveTaskLabelDto } from '#modules/labels/taskLabel.schemas.js'

export interface TaskLabelRepository {
  add(taskLabel: AddTaskLabelDto): Promise<TaskLabel | undefined>
  findByLabelId(labelId: string): Promise<TaskLabel[]>
  findByTaskId(taskId: string): Promise<TaskLabel[]>
  remove(taskLabel: RemoveTaskLabelDto): Promise<void>
}
