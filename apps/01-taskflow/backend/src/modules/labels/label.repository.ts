import type { Label } from '#modules/labels/label.model.js'
import type { CreateLabelDto, UpdateLabelDto } from '#modules/labels/label.schemas.js'

export interface LabelRepository {
  create(label: CreateLabelDto): Promise<Label | undefined>
  delete(id: string): Promise<void>
  findAll(): Promise<Label[]>
  findById(id: string): Promise<Label | undefined>
  findByTaskId(taskId: string): Promise<Label[]>
  update(labelId: string, label: UpdateLabelDto): Promise<Label | undefined>
}
