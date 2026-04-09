import { del, get, put } from '@/api/client'
import type { Column, UpdateColumnDto } from '@/types/column'

const columnsApiUrl = '/columns'

export async function getColumn(id: string) {
  return get<Column>(`${columnsApiUrl}/${id}`)
}

export async function updateColumn(id: string, body: UpdateColumnDto) {
  return put<UpdateColumnDto, Column>(`${columnsApiUrl}/${id}`, body)
}

export async function deleteColumn(id: string) {
  return del(`${columnsApiUrl}/${id}`)
}
