import { del, get, patch, post, put } from '@/api/client'
import { boardsApiUrl, columnsApiUrl, snapshotsApiUrl, tasksApiUrl } from '@/api/endpoints'
import type { CreateBoardDto, UpdateBoardDto } from '@/schemas/boardSchemas'
import type { Board, BoardState } from '@/types/board'
import type { Column } from '@/types/column'
import type { Filter } from '@/types/filter'
import type { CreateSnapshotDto, Snapshot } from '@/types/snapshot'
import type { Task } from '@/types/task'

export async function getBoards() {
  const result = await get<Board[]>(boardsApiUrl)
  return result
}

export async function getBoard(id: string) {
  const result = await get<Board>(`${boardsApiUrl}/${id}`)
  return result
}

export async function createBoard(body: CreateBoardDto) {
  const result = await post<CreateBoardDto, Board>(boardsApiUrl, body)
  return result
}

export async function deleteBoard(id: string) {
  const result = await del(`${boardsApiUrl}/${id}`)
  return result
}

export async function updateBoard(id: string, body: UpdateBoardDto) {
  const result = await put<UpdateBoardDto, Board>(`${boardsApiUrl}/${id}`, body)
  return result
}

export async function getBoardSnapshots(id: string) {
  const result = await get<Snapshot[]>(`${boardsApiUrl}/${id}${snapshotsApiUrl}`)
  return result
}

export async function createBoardSnapshot(id: string, body: CreateSnapshotDto) {
  const result = await post<CreateSnapshotDto, Snapshot>(`${boardsApiUrl}/${id}${snapshotsApiUrl}`, body)
  return result
}

export async function undoBoardSnapshot(id: string) {
  const result = await post<never, BoardState>(`${boardsApiUrl}/${id}/undo`)
  return result
}

export async function redoBoardSnapshot(id: string) {
  const result = await post<never, BoardState>(`${boardsApiUrl}/${id}/redo`)
  return result
}

export async function getBoardTasks(id: string, filter: Filter) {
  const query = Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== undefined))

  const urlSearchQuery = new URLSearchParams(query).toString()

  const result = await get<Task[]>(`${boardsApiUrl}/${id}${tasksApiUrl}${urlSearchQuery ? `?${urlSearchQuery}` : ''}`)
  return result
}

export async function getBoardColumns(id: string) {
  const result = await get<Column[]>(`${boardsApiUrl}/${id}${columnsApiUrl}`)
  return result
}

export async function reorderColumns(id: string, body: { columnIds: string[] }) {
  const result = await patch<{ columnIds: string[] }, Column[]>(`${boardsApiUrl}/${id}${columnsApiUrl}/reorder`, body)
  return result
}
