import type { BoardRepository } from '#modules/boards/board.repository.js'
import type { ColumnRepository } from '#modules/columns/column.repository.js'
import type { LabelRepository } from '#modules/labels/label.repository.js'
import type { SnapshotRepository } from '#modules/boards/snapshot.repository.js'
import type { SubtaskRepository } from '#modules/subtasks/subtask.repository.js'
import type { TaskLabelRepository } from '#modules/labels/taskLabel.repository.js'
import type { TaskRepository } from '#modules/tasks/task.repository.js'

import { db } from '#shared/db/connection.js'
import { DrizzleBoardRepository } from '#modules/boards/board.repository.drizzle.js'
import { DrizzleColumnRepository } from '#modules/columns/column.repository.drizzle.js'
import { DrizzleLabelRepository } from '#modules/labels/label.repository.drizzle.js'
import { DrizzleSnapshotRepository } from '#modules/boards/snapshot.repository.drizzle.js'
import { DrizzleSubtaskRepository } from '#modules/subtasks/subtask.repository.drizzle.js'
import { DrizzleTaskLabelRepository } from '#modules/labels/taskLabel.repository.drizzle.js'
import { DrizzleTaskRepository } from '#modules/tasks/task.repository.drizzle.js'
import { BoardService } from '#modules/boards/board.service.js'
import { ColumnService } from '#modules/columns/column.service.js'
import { LabelService } from '#modules/labels/label.service.js'
import { SubtaskService } from '#modules/subtasks/subtask.service.js'
import { TaskLabelService } from '#modules/labels/taskLabel.service.js'
import { TaskService } from '#modules/tasks/task.service.js'

const boardRepository: BoardRepository = new DrizzleBoardRepository(db)
const columnRepository: ColumnRepository = new DrizzleColumnRepository(db)
const labelRepository: LabelRepository = new DrizzleLabelRepository(db)
const snapshotRepository: SnapshotRepository = new DrizzleSnapshotRepository(db)
const subtaskRepository: SubtaskRepository = new DrizzleSubtaskRepository(db)
const taskLabelRepository: TaskLabelRepository = new DrizzleTaskLabelRepository(db)
const taskRepository: TaskRepository = new DrizzleTaskRepository(db)

export const columnService = new ColumnService(columnRepository)
export const labelService = new LabelService(labelRepository)
export const subtaskService = new SubtaskService(subtaskRepository)
export const taskLabelService = new TaskLabelService(taskLabelRepository)
export const taskService = new TaskService(taskRepository, subtaskService, taskLabelService)
export const boardService = new BoardService(
  boardRepository,
  columnService,
  snapshotRepository,
  subtaskService,
  taskLabelService,
  taskService,
)
