import type { NewSnapshot, Snapshot } from "#patterns/memento/types.js"
import type { CreateSnapshotDto } from "#schemas/snapshotSchemas.js"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { snapshotsTable } from "#db/schema.js"
import { eq } from "drizzle-orm"

export class SnapshotRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create({ boardId, description, state }: CreateSnapshotDto): Promise<Snapshot | undefined> {
    const newSnapshot: NewSnapshot = {
      boardId,
      description,
      state,
    }

    const result = await this.db.insert(snapshotsTable).values(this.toRow(newSnapshot)).returning()

    const snapshots = result.map((row) => this.toSnapshot(row))

    return snapshots[0]
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(snapshotsTable).where(eq(snapshotsTable.id, id))
  }

  async deleteByBoardId(boardId: string): Promise<void> {
    await this.db.delete(snapshotsTable).where(eq(snapshotsTable.boardId, boardId))
  }

  async findByBoardId(boardId: string): Promise<Snapshot[]> {
    const result = await this.db
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.boardId, boardId))

    const snapshots = result.map((snapshotRow) => this.toSnapshot(snapshotRow))

    return snapshots
  }

  async findById(id: string): Promise<Snapshot | undefined> {
    const result = await this.db
      .select()
      .from(snapshotsTable)
      .where(eq(snapshotsTable.id, id))
      .limit(1)

    const snapshots = result.map((snapshotRow) => this.toSnapshot(snapshotRow))

    return snapshots[0]
  }

  private toRow(snapshot: NewSnapshot): typeof snapshotsTable.$inferInsert {
    return {
      boardId: snapshot.boardId,
      description: snapshot.description,
      state: snapshot.state,
    }
  }

  private toSnapshot(row: typeof snapshotsTable.$inferSelect): Snapshot {
    return {
      boardId: row.boardId,
      description: row.description,
      id: row.id,
      state: row.state,
    }
  }
}
