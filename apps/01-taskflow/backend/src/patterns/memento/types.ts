export type NewSnapshot = Omit<Snapshot, 'id'>

export interface Snapshot {
  boardId: string
  description: null | string
  id: string
  state: string
}