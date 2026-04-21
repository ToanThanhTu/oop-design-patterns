import type { SubtaskRepository } from '#modules/subtasks/subtask.repository.js'
import type { SubtaskType } from '#modules/subtasks/subtask.types.js'
import type { CreateSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/subtask.schemas.js'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { subtasksTable } from '#shared/db/schema.js'
import { Subtask } from '#modules/subtasks/subtask.model.js'
import { eq } from 'drizzle-orm'

export class DrizzleSubtaskRepository implements SubtaskRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(subtask: CreateSubtaskDto): Promise<Subtask | undefined> {
    const result = await this.db.insert(subtasksTable).values(this.toRow(subtask)).returning()

    const subtasks = result.map((subtaskRow) => this.toSubtask(subtaskRow))

    return subtasks[0]
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(subtasksTable).where(eq(subtasksTable.id, id))
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    await this.db.delete(subtasksTable).where(eq(subtasksTable.taskId, taskId))
  }

  async findById(id: string): Promise<Subtask | undefined> {
    const result = await this.db
      .select()
      .from(subtasksTable)
      .where(eq(subtasksTable.id, id))
      .limit(1)

    const subtasks = result.map((subtaskRow) => this.toSubtask(subtaskRow))

    return subtasks[0]
  }

  async findByTaskId(taskId: string): Promise<Subtask[]> {
    const result = await this.db
      .select()
      .from(subtasksTable)
      .where(eq(subtasksTable.taskId, taskId))

    const subtasks = result.map((subtaskRow) => this.toSubtask(subtaskRow))

    return subtasks
  }

  async recreateRaw(subtask: SubtaskType): Promise<Subtask | undefined> {
    const result = await this.db.insert(subtasksTable).values(subtask).returning()

    const subtasks = result.map((row) => this.toSubtask(row))

    return subtasks[0]
  }

  async update(subtaskId: string, subtask: UpdateSubtaskDto): Promise<Subtask | undefined> {
    const result = await this.db
      .update(subtasksTable)
      .set(subtask)
      .where(eq(subtasksTable.id, subtaskId))
      .returning()

    const subtasks = result.map((subtaskRow) => this.toSubtask(subtaskRow))

    return subtasks[0]
  }

  private toRow(subtask: CreateSubtaskDto): typeof subtasksTable.$inferInsert {
    return {
      isComplete: subtask.isComplete,
      position: subtask.position,
      taskId: subtask.taskId,
      title: subtask.title,
    }
  }

  private toSubtask(row: typeof subtasksTable.$inferSelect): Subtask {
    return new Subtask({
      id: row.id,
      isComplete: row.isComplete,
      position: row.position,
      taskId: row.taskId,
      title: row.title,
    })
  }
}
