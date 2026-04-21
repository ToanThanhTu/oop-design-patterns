import { del, get, post, put } from '@/api/client'
import { boardsApiUrl, columnsApiUrl } from '@/api/endpoints'
import type { CreateColumnDto, UpdateColumnDto } from '@/schemas/columnSchemas'
import type { Column } from '@/types/column'

export async function getColumn(id: string) {
  return get<Column>(`${columnsApiUrl}/${id}`)
}

export async function createColumn(boardId: string, body: CreateColumnDto) {
  return post<CreateColumnDto, Column>(`${boardsApiUrl}/${boardId}/columns`, body)
}

export async function updateColumn(id: string, body: UpdateColumnDto) {
  return put<UpdateColumnDto, Column>(`${columnsApiUrl}/${id}`, body)
}

export async function deleteColumn(id: string) {
  return del(`${columnsApiUrl}/${id}`)
}
