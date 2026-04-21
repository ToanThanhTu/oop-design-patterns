import { del, put } from '@/shared/api/client'
import type { Subtask, UpdateSubtaskDto } from '@/modules/subtasks/entities/subtask'

const subtasksApiUrl = '/subtasks'

export async function updateSubtask(id: string, body: UpdateSubtaskDto) {
  return put<UpdateSubtaskDto, Subtask>(`${subtasksApiUrl}/${id}`, body)
}

export async function deleteSubtask(id: string) {
  return del(`${subtasksApiUrl}/${id}`)
}
