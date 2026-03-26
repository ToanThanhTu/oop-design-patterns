import { db } from "#db/connection.js"
import { BoardRepository } from "#repositories/boardRepository.js"
import { ColumnRepository } from "#repositories/columnRepository.js"
import { SnapshotRepository } from "#repositories/snapshotRepository.js"
import { SubtaskRepository } from "#repositories/subtaskRepository.js"
import { TaskLabelRepository } from "#repositories/taskLabelRepository.js"
import { TaskRepository } from "#repositories/taskRepository.js"
import { BoardService } from "#services/boardService.js"
import { ColumnService } from "#services/columnService.js"
import { SubtaskService } from "#services/subtaskService.js"
import { TaskLabelService } from "#services/taskLabelService.js"
import { TaskService } from "#services/taskService.js"

const taskRepository = new TaskRepository(db)
const taskLabelRepository = new TaskLabelRepository(db)
const snapshotRepository = new SnapshotRepository(db)
const subtaskRepository = new SubtaskRepository(db)
const boardRepository = new BoardRepository(db)
const columnRepository = new ColumnRepository(db)

export const columnService = new ColumnService(columnRepository)
export const subtaskService = new SubtaskService(subtaskRepository)
export const taskLabelService = new TaskLabelService(taskLabelRepository)
export const taskService = new TaskService(taskRepository, subtaskService, taskLabelService)
export const boardService = new BoardService(boardRepository, columnService, snapshotRepository, subtaskService, taskLabelService, taskService)
