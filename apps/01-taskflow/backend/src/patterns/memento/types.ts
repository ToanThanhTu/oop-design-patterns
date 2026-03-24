import type { BoardType } from "#models/board/types.js"
import type { ColumnType } from "#models/column/types.js"
import type { SubtaskType } from "#models/subtask/types.js"
import type { TaskType } from "#models/task/types.js"
import type { TaskLabelType } from "#models/taskLabel/types.js"

export interface BoardStateType {
  board: BoardType
  columns: ColumnType[]
  subtasks: SubtaskType[]
  taskLabels: TaskLabelType[]
  tasks: TaskType[]
}

export type NewSnapshot = Omit<Snapshot, "id">

export interface Snapshot {
  boardId: string
  description: null | string
  id: string
  state: string
}
