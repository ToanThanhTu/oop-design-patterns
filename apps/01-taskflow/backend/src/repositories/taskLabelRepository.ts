import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { taskLabelsTable } from "#db/schema.js";
import { TaskLabel } from "#models/taskLabel/taskLabel.js";
import { and, eq } from "drizzle-orm";

export class TaskLabelRepository {
  constructor(private db: BetterSQLite3Database) {}

  async add(taskId: string, labelId: string): Promise<TaskLabel[]> {
    const result = await this.db.insert(taskLabelsTable).values({labelId, taskId}).returning()

    const taskLabels = result.map(row => this.toTaskLabel(row))

    return taskLabels
  }

  async findByLabelId(labelId: string): Promise<TaskLabel[]> {
    const result = await this.db.select().from(taskLabelsTable).where(eq(taskLabelsTable.labelId, labelId))
  
    const taskLabels = result.map(row => this.toTaskLabel(row))

    return taskLabels
  }

  async findByTaskId(taskId: string): Promise<TaskLabel[]> {
    const result = await this.db.select().from(taskLabelsTable).where(eq(taskLabelsTable.taskId, taskId))
  
    const taskLabels = result.map(row => this.toTaskLabel(row))

    return taskLabels
  }
  
  async remove(taskId: string, labelId: string): Promise<void> {
    await this.db
      .delete(taskLabelsTable)
      .where(and(
        eq(taskLabelsTable.taskId, taskId), 
        eq(taskLabelsTable.labelId, labelId)
      ))
  }

  private toTaskLabel(row: typeof taskLabelsTable.$inferSelect): TaskLabel {
    return new TaskLabel({
      labelId: row.labelId,
      taskId: row.taskId
    })
  }
}