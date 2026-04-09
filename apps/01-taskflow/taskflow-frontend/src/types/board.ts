import type { Column } from "@/types/column"
import type { Subtask } from "@/types/subtask"
import type { Task } from "@/types/task"
import type { TaskLabel } from "@/types/taskLabel"

export interface Board {
  createdAt: string
  id: string
  name: string
  updatedAt: string
}

export interface CreateBoardDto {
  name: string
}

export interface UpdateBoardDto {
  name: string
}

export interface BoardState {
  board: Board
  columns: Column[]
  subtasks: Subtask[]
  taskLabels: TaskLabel[]
  tasks: Task[]
}