import type { CreateBoardDto, UpdateBoardDto } from "#schemas/boardSchemas.js"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { boardsTable } from "#db/schema.js"
import { Board } from "#models/board/board.js"
import { eq } from "drizzle-orm"

export class BoardRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(board: CreateBoardDto): Promise<Board | undefined> {
    const result = await this.db.insert(boardsTable).values(this.toRow(board)).returning()

    const boards = result.map((boardRow) => this.toBoard(boardRow))

    return boards[0]
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(boardsTable).where(eq(boardsTable.id, id))
  }

  async findAll(): Promise<Board[]> {
    const result = await this.db.select().from(boardsTable)

    const boards = result.map((boardRow) => this.toBoard(boardRow))

    return boards
  }

  async findById(id: string): Promise<Board | undefined> {
    const result = await this.db.select().from(boardsTable).where(eq(boardsTable.id, id)).limit(1)

    const boards = result.map((boardRow) => this.toBoard(boardRow))

    return boards[0]
  }

  async update(boardId: string, board: UpdateBoardDto): Promise<Board | undefined> {
    const result = await this.db
      .update(boardsTable)
      .set(board)
      .where(eq(boardsTable.id, boardId))
      .returning()

    const boards = result.map((boardRow) => this.toBoard(boardRow))

    return boards[0]
  }

  private toBoard(row: typeof boardsTable.$inferSelect): Board {
    return new Board({
      createdAt: row.createdAt,
      id: row.id,
      name: row.name,
      updatedAt: row.updatedAt,
    })
  }

  private toRow(board: CreateBoardDto): typeof boardsTable.$inferInsert {
    return {
      name: board.name,
    }
  }
}
