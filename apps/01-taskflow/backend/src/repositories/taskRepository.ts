import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import { tasksTable } from "#db/schema.js"
import { Task } from "#models/task/task.js"
import { eq } from "drizzle-orm"

export class TaskRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(task: Omit<Task, "id">): Promise<Task[]> {
    return await this.db.insert(tasksTable).values(task).returning()
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.id, id))
  }

  async findByColumnId(columnId: string): Promise<Task[]> {
    const result = await this.db.select().from(tasksTable).where(eq(tasksTable.columnId, columnId))

    return result
  }

  async findById(id: string): Promise<Task | undefined> {
    const result = await this.db.select().from(tasksTable).where(eq(tasksTable.id, id)).limit(1)

    return result[0]
  }

  async update(task: Task): Promise<Task[]> {
    return await this.db.update(tasksTable).set(task).where(eq(tasksTable.id, task.getId()))
  }

  // Convert DB row to Task instance
  private toTask(row: typeof tasksTable.$inferSelect): Task {
    return new Task({
      assignee: row.assignee,
      columnId: row.columnId,
      createdAt: row.createdAt,
      description: row.description,
      dueDate: row.dueDate,
      id: row.id,
      isTemplate: row.isTemplate,
      position: row.position,
      priority: row.priority,
      title: row.title,
      type: row.type,
      updatedAt: row.updatedAt,
    })
  }

  // Convert Task instance to plain object for Drizzle
  private toRow(task: Task): typeof tasksTable.$inferInsert {}
}
