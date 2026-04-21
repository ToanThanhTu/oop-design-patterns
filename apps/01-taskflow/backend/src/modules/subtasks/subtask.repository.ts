import type { Subtask } from '#modules/subtasks/subtask.model.js'
import type { CreateSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/subtask.schemas.js'
import type { SubtaskType } from '#modules/subtasks/subtask.types.js'

export interface SubtaskRepository {
  create(subtask: CreateSubtaskDto): Promise<Subtask | undefined>
  delete(id: string): Promise<void>
  deleteByTaskId(taskId: string): Promise<void>
  findById(id: string): Promise<Subtask | undefined>
  findByTaskId(taskId: string): Promise<Subtask[]>
  recreateRaw(subtask: SubtaskType): Promise<Subtask | undefined>
  update(subtaskId: string, subtask: UpdateSubtaskDto): Promise<Subtask | undefined>
}
