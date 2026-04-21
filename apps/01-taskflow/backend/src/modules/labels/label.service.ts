import type { Label } from '#modules/labels/label.model.js'
import type { LabelRepository } from '#modules/labels/label.repository.js'
import type { CreateLabelDto } from '#modules/labels/label.schemas.js'

export class LabelService {
  private labelRepository: LabelRepository

  constructor(labelRepository: LabelRepository) {
    this.labelRepository = labelRepository
  }

  async create(label: CreateLabelDto): Promise<Label | undefined> {
    return await this.labelRepository.create(label)
  }

  async getAll(): Promise<Label[]> {
    return await this.labelRepository.findAll()
  }

  async getByTaskId(taskId: string): Promise<Label[]> {
    return await this.labelRepository.findByTaskId(taskId)
  }

  async getOne(id: string): Promise<Label | undefined> {
    return await this.labelRepository.findById(id)
  }
}
