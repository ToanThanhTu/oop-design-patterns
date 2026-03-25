import type { CreateSubtaskDto, SubtaskType } from "#models/subtask/types.js";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { subtasksTable } from "#db/schema.js";
import { Subtask } from "#models/subtask/subtask.js";
import { eq } from "drizzle-orm";

export class SubtaskRepository {
  constructor(private db: BetterSQLite3Database) {}
  
  async create(subtask: CreateSubtaskDto): Promise<Subtask[]> {
    const result = await this.db.insert(subtasksTable).values(this.toRow(subtask)).returning()
    
    const subtasks = result.map(subtaskRow => this.toSubtask(subtaskRow))

    return subtasks
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(subtasksTable).where(eq(subtasksTable.id, id))
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    await this.db.delete(subtasksTable).where(eq(subtasksTable.taskId, taskId))
  }

  async findById(id: string): Promise<Subtask | undefined> {
    const result = await this.db.select().from(subtasksTable).where(eq(subtasksTable.id, id)).limit(1)

    const subtasks = result.map(subtaskRow => this.toSubtask(subtaskRow))

    return subtasks[0]
  }

  async findByTaskId(taskId: string): Promise<Subtask[]> {
    const result = await this.db.select().from(subtasksTable).where(eq(subtasksTable.taskId, taskId))
        
    const subtasks = result.map(subtaskRow => this.toSubtask(subtaskRow))

    return subtasks
  }

  async recreateRaw(subtask: SubtaskType): Promise<Subtask | undefined> {
    const result = await this.db.insert(subtasksTable).values(subtask).returning()

    const tasks = result.map(row => this.toSubtask(row))

    return tasks[0]
  }

  async update(subtask: Subtask): Promise<Subtask[]> {
    const result = await this.db.update(subtasksTable).set(this.toRow(subtask)).where(eq(subtasksTable.id, subtask.id)).returning()
    
    const subtasks = result.map(subtaskRow => this.toSubtask(subtaskRow))

    return subtasks
  }

  private toRow(subtask: CreateSubtaskDto | Subtask): typeof subtasksTable.$inferInsert {
    return {
      isComplete: subtask.isComplete,
      position: subtask.position,
      taskId: subtask.taskId,
      title: subtask.title
    }
  }

  private toSubtask(row: typeof subtasksTable.$inferSelect): Subtask {
    return new Subtask({
      id: row.id,
      isComplete: row.isComplete,
      position: row.position,
      taskId: row.taskId,
      title: row.title
    })
  }
}