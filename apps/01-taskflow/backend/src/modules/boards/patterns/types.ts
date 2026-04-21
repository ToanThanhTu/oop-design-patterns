import type { BoardType } from '#modules/boards/board.types.js'
import type { ColumnType } from '#modules/columns/column.types.js'
import type { SubtaskType } from '#modules/subtasks/subtask.types.js'
import type { TaskType } from '#modules/tasks/task.types.js'
import type { TaskLabelType } from '#modules/labels/taskLabel.types.js'

export interface BoardStateType {
  board: BoardType
  columns: ColumnType[]
  subtasks: SubtaskType[]
  taskLabels: TaskLabelType[]
  tasks: TaskType[]
}

export type NewSnapshot = Omit<Snapshot, 'id'>

export interface Snapshot {
  boardId: string
  description: null | string
  id: string
  state: string
}
