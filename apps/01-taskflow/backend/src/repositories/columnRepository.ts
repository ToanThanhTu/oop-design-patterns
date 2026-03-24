import type { CreateColumnDto } from "#models/column/types.js";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { columnsTable } from "#db/schema.js";
import { Column } from "#models/column/column.js";
import { eq } from "drizzle-orm";

export class ColumnRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(column: CreateColumnDto): Promise<Column[]> {
    const result = await this.db.insert(columnsTable).values(this.toRow(column)).returning()
    
    const columns = result.map(columnRow => this.toColumn(columnRow))

    return columns
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(columnsTable).where(eq(columnsTable.id, id))
  }

  async findAll(): Promise<Column[]> {
    const result = await this.db.select().from(columnsTable)

    const columns = result.map(columnRow => this.toColumn(columnRow))

    return columns
  }

  async findByBoardId(boardId: string): Promise<Column[]> {
    const result = await this.db.select().from(columnsTable).where(eq(columnsTable.boardId, boardId))
        
    const columns = result.map(columnRow => this.toColumn(columnRow))

    return columns
  }

  async findById(id: string): Promise<Column | undefined> {
    const result = await this.db.select().from(columnsTable).where(eq(columnsTable.id, id)).limit(1)

    const columns = result.map(columnRow => this.toColumn(columnRow))

    return columns[0]
  }

  async update(column: Column): Promise<Column[]> {
    const result = await this.db.update(columnsTable).set(this.toRow(column)).where(eq(columnsTable.id, column.id)).returning()
    
    const columns = result.map(columnRow => this.toColumn(columnRow))

    return columns
  }

  private toColumn(row: typeof columnsTable.$inferSelect): Column {
    return new Column({
      boardId: row.boardId,
      createdAt: row.createdAt,
      id: row.id,
      name: row.name,
      position: row.position,
      updatedAt: row.updatedAt,
    })
  }

  private toRow(column: Column | CreateColumnDto): typeof columnsTable.$inferInsert {
    return {
      boardId: column.boardId,
      name: column.name,
      position: column.position,
    }
  }
}