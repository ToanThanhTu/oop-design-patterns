export interface Label {
  color: string
  id: string
  name: string
}

export interface CreateLabelDto {
  color: string
  name: string
}

export type UpdateLabelDto = Partial<CreateLabelDto>
