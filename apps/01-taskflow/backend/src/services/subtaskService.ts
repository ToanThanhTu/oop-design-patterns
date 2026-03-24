import type { Subtask } from "#models/subtask/subtask.js"
import type { CreateSubtaskDto } from "#models/subtask/types.js"
import type { SubtaskRepository } from "#repositories/subtaskRepository.js"

export class SubtaskService {
  private subtaskRepository: SubtaskRepository

  constructor(subtaskRepository: SubtaskRepository) {
    this.subtaskRepository = subtaskRepository
  }

  create(subtask: CreateSubtaskDto): Promise<Subtask[]> {
    return this.subtaskRepository.create(subtask)
  }

  delete(subtaskId: string): Promise<void> {
    return this.subtaskRepository.delete(subtaskId)
  }

  getById(subtaskId: string): Promise<Subtask | undefined> {
    return this.subtaskRepository.findById(subtaskId)
  }

  getByTaskId(taskId: string): Promise<Subtask[]> {
    return this.subtaskRepository.findByTaskId(taskId)
  }

  update(subtask: Subtask): Promise<Subtask[]> {
    return this.subtaskRepository.update(subtask)
  }
}