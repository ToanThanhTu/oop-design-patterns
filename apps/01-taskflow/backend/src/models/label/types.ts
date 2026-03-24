export type CreateLabelDto = Omit<LabelType, "id">

export interface LabelType {
  color: string,
  id: string,
  name: string
}