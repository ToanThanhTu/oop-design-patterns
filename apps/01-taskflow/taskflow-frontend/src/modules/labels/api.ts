import { get, post } from '@/shared/api/client'
import type { CreateLabelDto, Label } from '@/modules/labels/entities/label'

const labelsApiUrl = '/labels'

export async function getLabels() {
  return get<Label[]>(labelsApiUrl)
}

export async function createLabel(body: CreateLabelDto) {
  return post<CreateLabelDto, Label>(labelsApiUrl, body)
}
