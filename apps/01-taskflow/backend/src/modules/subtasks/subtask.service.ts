import type { Subtask } from '#modules/subtasks/subtask.model.js'
import type { SubtaskType } from '#modules/subtasks/subtask.types.js'
import type { SubtaskRepository } from '#modules/subtasks/subtask.repository.js'
import type { CreateSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/subtask.schemas.js'

export class SubtaskService {
  private subtaskRepository: SubtaskRepository

  constructor(subtaskRepository: SubtaskRepository) {
    this.subtaskRepository = subtaskRepository
  }

  create(subtask: CreateSubtaskDto): Promise<Subtask | undefined> {
    return this.subtaskRepository.create(subtask)
  }

  delete(subtaskId: string): Promise<void> {
    return this.subtaskRepository.delete(subtaskId)
  }

  deleteByTaskId(taskId: string): Promise<void> {
    return this.subtaskRepository.deleteByTaskId(taskId)
  }

  getById(subtaskId: string): Promise<Subtask | undefined> {
    return this.subtaskRepository.findById(subtaskId)
  }

  getByTaskId(taskId: string): Promise<Subtask[]> {
    return this.subtaskRepository.findByTaskId(taskId)
  }

  recreateRaw(subtask: SubtaskType): Promise<Subtask | undefined> {
    return this.subtaskRepository.recreateRaw(subtask)
  }

  update(subtaskId: string, subtask: UpdateSubtaskDto): Promise<Subtask | undefined> {
    return this.subtaskRepository.update(subtaskId, subtask)
  }
}
