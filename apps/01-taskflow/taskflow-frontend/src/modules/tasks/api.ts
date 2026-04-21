import { del, get, post, put } from '@/shared/api/client'
import type { Label } from '@/modules/labels/entities/label'
import type { CreateSubtaskDto, Subtask } from '@/modules/subtasks/entities/subtask'
import type { CreateTaskDto, UpdateTaskDto } from '@/modules/tasks/schemas'
import type { Task } from '@/modules/tasks/entities/task'
import type { TaskLabel } from '@/modules/labels/entities/taskLabel'

const tasksApiUrl = '/tasks'

export async function getTask(id: string) {
  return get<Task>(`${tasksApiUrl}/${id}`)
}

export async function createTask(columnId: string, body: Omit<CreateTaskDto, 'columnId'>) {
  return post<Omit<CreateTaskDto, 'columnId'>, Task>(`/columns/${columnId}${tasksApiUrl}`, body)
}

export async function updateTask(id: string, body: UpdateTaskDto) {
  return put<UpdateTaskDto, Task>(`${tasksApiUrl}/${id}`, body)
}

export async function deleteTask(id: string) {
  return del(`${tasksApiUrl}/${id}`)
}

export async function cloneTask(id: string) {
  return post<never, Task>(`${tasksApiUrl}/${id}/clone`)
}

export async function getTaskSubtasks(id: string) {
  return get<Subtask[]>(`${tasksApiUrl}/${id}/subtasks`)
}

export async function createTaskSubtask(id: string, body: Omit<CreateSubtaskDto, 'taskId'>) {
  return post<Omit<CreateSubtaskDto, 'taskId'>, Subtask>(`${tasksApiUrl}/${id}/subtasks`, body)
}

export async function getTaskLabels(id: string) {
  return get<Label[]>(`${tasksApiUrl}/${id}/labels`)
}

export async function attachLabel(taskId: string, labelId: string) {
  return post<{ labelId: string }, TaskLabel>(`${tasksApiUrl}/${taskId}/labels`, { labelId })
}

export async function detachLabel(taskId: string, labelId: string) {
  return del(`${tasksApiUrl}/${taskId}/labels/${labelId}`)
}
