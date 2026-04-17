import type { TaskType } from '#models/task/types.js'
import type { CreateTaskDto, UpdateTaskDto } from '#schemas/taskSchemas.js'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { tasksTable } from '#db/schema.js'
import { Task } from '#models/task/task.js'
import { eq } from 'drizzle-orm'

export class TaskRepository {
  constructor(private db: BetterSQLite3Database) {}

  async create(task: CreateTaskDto): Promise<Task | undefined> {
    const result = await this.db.insert(tasksTable).values(this.toRow(task)).returning()

    const tasks = result.map((taskRow) => this.toTask(taskRow))

    return tasks[0]
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.id, id))
  }

  async deleteByColumnId(columnId: string): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.columnId, columnId))
  }

  async findByColumnId(columnId: string): Promise<Task[]> {
    const result = await this.db.select().from(tasksTable).where(eq(tasksTable.columnId, columnId))

    const tasks = result.map((taskRow) => this.toTask(taskRow))

    return tasks
  }

  async findById(id: string): Promise<Task | undefined> {
    const result = await this.db.select().from(tasksTable).where(eq(tasksTable.id, id)).limit(1)

    const tasks = result.map((taskRow) => this.toTask(taskRow))

    return tasks[0]
  }

  async recreateRaw(task: TaskType): Promise<Task | undefined> {
    const result = await this.db.insert(tasksTable).values(task).returning()

    const tasks = result.map((row) => this.toTask(row))

    return tasks[0]
  }

  async update(taskId: string, task: UpdateTaskDto): Promise<Task | undefined> {
    const result = await this.db
      .update(tasksTable)
      .set(task)
      .where(eq(tasksTable.id, taskId))
      .returning()

    const tasks = result.map((taskRow) => this.toTask(taskRow))

    return tasks[0]
  }

  // Convert Task instance to plain object for Drizzle for creation and update
  private toRow(task: CreateTaskDto): typeof tasksTable.$inferInsert {
    return {
      assignee: task.assignee,
      columnId: task.columnId,
      description: task.description,
      dueDate: task.dueDate,
      isTemplate: task.isTemplate,
      position: task.position!,
      priority: task.priority,
      title: task.title,
      type: task.type,
    }
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
}
