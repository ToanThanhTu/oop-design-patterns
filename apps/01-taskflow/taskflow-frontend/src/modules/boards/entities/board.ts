import type { Column } from "@/modules/columns/entities/column"
import type { Subtask } from "@/modules/subtasks/entities/subtask"
import type { Task } from "@/modules/tasks/entities/task"
import type { TaskLabel } from "@/modules/labels/entities/taskLabel"

export interface Board {
  createdAt: string
  id: string
  name: string
  updatedAt: string
}

export interface BoardState {
  board: Board
  columns: Column[]
  subtasks: Subtask[]
  taskLabels: TaskLabel[]
  tasks: Task[]
}