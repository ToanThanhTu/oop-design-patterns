import { errorHandler } from '#shared/middleware/errorHandler.js'
import {
  createBoard,
  createBoardSnapshot,
  deleteBoard,
  getBoard,
  getBoardColumns,
  getBoards,
  getBoardSnapshots,
  getBoardTasks,
  redoBoardSnapshot,
  reorderColumns,
  undoBoardSnapshot,
  updateBoard,
} from '#modules/boards/board.routes.js'
import { createColumn, deleteColumn, getColumn, updateColumn } from '#modules/columns/column.routes.js'
import { createLabel, getLabels } from '#modules/labels/label.routes.js'
import { deleteSubtask, updateSubtask } from '#modules/subtasks/subtask.routes.js'
import {
  attachLabel,
  cloneTask,
  createSubtask,
  createTask,
  deleteTask,
  detachLabel,
  getTask,
  getTaskLabels,
  getTaskSubtasks,
  updateTask,
} from '#modules/tasks/task.routes.js'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const port = process.env.PORT ?? '3001'

const app = express()
app.use(cors())
app.use(express.json())

const BOARD_ROUTE = '/boards'
const COLUMN_ROUTE = '/columns'
const TASK_ROUTE = '/tasks'
const SUBTASK_ROUTE = '/subtasks'
const LABEL_ROUTE = '/labels'

// Boards
app.get(BOARD_ROUTE, getBoards)
app.get(`${BOARD_ROUTE}/:id`, getBoard)
app.post(BOARD_ROUTE, createBoard)
app.put(`${BOARD_ROUTE}/:id`, updateBoard)
app.delete(`${BOARD_ROUTE}/:id`, deleteBoard)

// Board Snapshots (Memento)
app.get(`${BOARD_ROUTE}/:id/snapshots`, getBoardSnapshots)
app.post(`${BOARD_ROUTE}/:id/snapshots`, createBoardSnapshot)
app.post(`${BOARD_ROUTE}/:id/undo`, undoBoardSnapshot)
app.post(`${BOARD_ROUTE}/:id/redo`, redoBoardSnapshot)

// Board Tasks (Iterator)
app.get(`${BOARD_ROUTE}/:id/tasks`, getBoardTasks)

// Board Columns
app.get(`${BOARD_ROUTE}/:id/columns`, getBoardColumns)
app.post(`${BOARD_ROUTE}/:id/columns`, createColumn)
app.patch(`${BOARD_ROUTE}/:id/columns/reorder`, reorderColumns)

// Columns
app.get(`${COLUMN_ROUTE}/:id`, getColumn)
app.put(`${COLUMN_ROUTE}/:id`, updateColumn)
app.delete(`${COLUMN_ROUTE}/:id`, deleteColumn)

// Column Tasks
app.post(`${COLUMN_ROUTE}/:id/tasks`, createTask)

// Tasks
app.get(`${TASK_ROUTE}/:id`, getTask)
app.put(`${TASK_ROUTE}/:id`, updateTask)
app.delete(`${TASK_ROUTE}/:id`, deleteTask)
app.post(`${TASK_ROUTE}/:id/clone`, cloneTask)

// Task Subtasks
app.get(`${TASK_ROUTE}/:id/subtasks`, getTaskSubtasks)
app.post(`${TASK_ROUTE}/:id/subtasks`, createSubtask)

// Task Labels
app.get(`${TASK_ROUTE}/:id/labels`, getTaskLabels)
app.post(`${TASK_ROUTE}/:id/labels`, attachLabel)
app.delete(`${TASK_ROUTE}/:taskId/labels/:labelId`, detachLabel)

// Subtasks
app.put(`${SUBTASK_ROUTE}/:id`, updateSubtask)
app.delete(`${SUBTASK_ROUTE}/:id`, deleteSubtask)

// Labels
app.get(LABEL_ROUTE, getLabels)
app.post(LABEL_ROUTE, createLabel)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
