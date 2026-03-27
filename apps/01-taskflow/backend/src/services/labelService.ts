import type { Label } from "#models/label/label.js";
import type { LabelRepository } from "#repositories/labelRepository.js";
import type { CreateLabelDto } from "#schemas/labelSchemas.js";

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
}