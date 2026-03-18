import { timestamps } from "#db/columns.helpers.js"
import {
  type AnySQLiteColumn,
  int,
  primaryKey,
  sqliteTable as table,
  text,
} from "drizzle-orm/sqlite-core"

export const boardsTable = table("boards_table", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  ...timestamps,
})

export const columnsTable = table("columns_table", {
  boardId: text("board_id").references((): AnySQLiteColumn => boardsTable.id),
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  position: int().notNull(),
  ...timestamps,
})

export const tasksTable = table("tasks_table", {
  assignee: text(),
  columnId: text("column_id").references((): AnySQLiteColumn => columnsTable.id),
  description: text(),
  dueDate: text("due_date"),
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isTemplate: int("is_template", { mode: "boolean" }).notNull().default(false),
  position: int().notNull(),
  priority: text().notNull().default("medium"),
  title: text().notNull(),
  type: text().notNull().default("task"),
  ...timestamps,
})

export const subtasksTable = table("subtasks_table", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isComplete: int("is_complete").notNull().default(0),
  position: int().notNull(),
  taskId: text("task_id").references((): AnySQLiteColumn => tasksTable.id),
  title: text().notNull(),
})

export const labelsTable = table("labels_table", {
  color: text().notNull(),
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
})

export const taskLabelsTable = table(
  "task_labels_table",
  {
    labelId: text("label_id"),
    taskId: text("task_id"),
  },
  (table) => [primaryKey({ columns: [table.labelId, table.taskId] })],
)

export const snapshotsTable = table("snapshots_table", {
  boardId: text("board_id").references((): AnySQLiteColumn => boardsTable.id),
  description: text(),
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  state: text().notNull(),
  ...timestamps,
})
