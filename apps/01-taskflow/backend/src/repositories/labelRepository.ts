import type { CreateLabelDto } from "#models/label/types.js";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { labelsTable } from "#db/schema.js";
import { Label } from "#models/label/label.js";
import { eq } from "drizzle-orm";

export class LabelRepository {
  constructor(private db: BetterSQLite3Database) {}
  
  async create(label: CreateLabelDto): Promise<Label[]> {
    const result = await this.db.insert(labelsTable).values(this.toRow(label)).returning()
    
    const labels = result.map(labelRow => this.toLabel(labelRow))

    return labels
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(labelsTable).where(eq(labelsTable.id, id))
  }

  async findAll(): Promise<Label[]> {
    const result = await this.db.select().from(labelsTable)

    const labels = result.map(labelRow => this.toLabel(labelRow))

    return labels
  }

  async findById(id: string): Promise<Label | undefined> {
    const result = await this.db.select().from(labelsTable).where(eq(labelsTable.id, id)).limit(1)

    const labels = result.map(labelRow => this.toLabel(labelRow))

    return labels[0]
  }

  async update(label: Label): Promise<Label[]> {
    const result = await this.db.update(labelsTable).set(this.toRow(label)).where(eq(labelsTable.id, label.id)).returning()
    
    const labels = result.map(labelRow => this.toLabel(labelRow))

    return labels
  }

  private toLabel(row: typeof labelsTable.$inferSelect): Label {
    return new Label({
      color: row.color,
      id: row.id,
      name: row.name
    })
  }

  private toRow(label: CreateLabelDto | Label): typeof labelsTable.$inferInsert {
    return {
      color: label.color,
      name: label.name
    }
  }
}