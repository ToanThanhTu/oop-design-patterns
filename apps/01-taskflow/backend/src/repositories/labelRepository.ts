import type { CreateLabelDto, UpdateLabelDto } from '#schemas/labelSchemas.js'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { labelsTable } from '#db/schema.js'
import { Label } from '#models/label/label.js'
import { eq } from 'drizzle-orm'

export class LabelRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(label: CreateLabelDto): Promise<Label | undefined> {
    const result = await this.db.insert(labelsTable).values(this.toRow(label)).returning()

    const labels = result.map((labelRow) => this.toLabel(labelRow))

    return labels[0]
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(labelsTable).where(eq(labelsTable.id, id))
  }

  async findAll(): Promise<Label[]> {
    const result = await this.db.select().from(labelsTable)

    const labels = result.map((labelRow) => this.toLabel(labelRow))

    return labels
  }

  async findById(id: string): Promise<Label | undefined> {
    const result = await this.db.select().from(labelsTable).where(eq(labelsTable.id, id)).limit(1)

    const labels = result.map((labelRow) => this.toLabel(labelRow))

    return labels[0]
  }

  async update(labelId: string, label: UpdateLabelDto): Promise<Label | undefined> {
    const result = await this.db
      .update(labelsTable)
      .set(label)
      .where(eq(labelsTable.id, labelId))
      .returning()

    const labels = result.map((labelRow) => this.toLabel(labelRow))

    return labels[0]
  }

  private toLabel(row: typeof labelsTable.$inferSelect): Label {
    return new Label({
      color: row.color,
      id: row.id,
      name: row.name,
    })
  }

  private toRow(label: CreateLabelDto): typeof labelsTable.$inferInsert {
    return {
      color: label.color,
      name: label.name,
    }
  }
}
