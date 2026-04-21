export interface Snapshot {
  boardId: string
  description: null | string
  id: string
  state: string
}

export interface CreateSnapshotDto {
  description: null | string
}