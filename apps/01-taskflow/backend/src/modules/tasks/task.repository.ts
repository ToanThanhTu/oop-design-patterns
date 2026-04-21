import type { Task } from '#modules/tasks/task.model.js'
import type { CreateTaskDto, UpdateTaskDto } from '#modules/tasks/task.schemas.js'
import type { TaskType } from '#modules/tasks/task.types.js'

export interface TaskRepository {
  create(task: CreateTaskDto): Promise<Task | undefined>
  delete(id: string): Promise<void>
  deleteByColumnId(columnId: string): Promise<void>
  findByColumnId(columnId: string): Promise<Task[]>
  findById(id: string): Promise<Task | undefined>
  recreateRaw(task: TaskType): Promise<Task | undefined>
  update(taskId: string, task: UpdateTaskDto): Promise<Task | undefined>
}
