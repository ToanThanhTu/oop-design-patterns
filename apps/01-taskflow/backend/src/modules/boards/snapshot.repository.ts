import type { Snapshot } from '#modules/boards/patterns/types.js'
import type { CreateSnapshotDto } from '#modules/boards/snapshot.schemas.js'

export interface SnapshotRepository {
  create(snapshot: CreateSnapshotDto): Promise<Snapshot | undefined>
  delete(id: string): Promise<void>
  deleteByBoardId(boardId: string): Promise<void>
  findByBoardId(boardId: string): Promise<Snapshot[]>
  findById(id: string): Promise<Snapshot | undefined>
}
