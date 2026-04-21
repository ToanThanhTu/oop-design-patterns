import { del, get, patch, post, put } from '@/shared/api/client'
import { boardsApiUrl, columnsApiUrl, snapshotsApiUrl, tasksApiUrl } from '@/shared/api/endpoints'
import type { CreateBoardDto, UpdateBoardDto } from '@/modules/boards/schemas'
import type { FilterType } from '@/shared/filter/schemas'
import type { Board, BoardState } from '@/modules/boards/entities/board'
import type { Column } from '@/modules/columns/entities/column'
import type { CreateSnapshotDto, Snapshot } from '@/modules/boards/entities/snapshot'
import type { Task } from '@/modules/tasks/entities/task'

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
  const result = await post<CreateSnapshotDto, Snapshot>(
    `${boardsApiUrl}/${id}${snapshotsApiUrl}`,
    body,
  )
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

export async function getBoardTasks(id: string, filter: FilterType) {
  const query = Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== undefined))

  const urlSearchQuery = new URLSearchParams(query).toString()

  const result = await get<Task[]>(
    `${boardsApiUrl}/${id}${tasksApiUrl}${urlSearchQuery ? `?${urlSearchQuery}` : ''}`,
  )
  return result
}

export async function getBoardColumns(id: string) {
  const result = await get<Column[]>(`${boardsApiUrl}/${id}${columnsApiUrl}`)
  return result
}

export async function reorderColumns(id: string, body: { columnIds: string[] }) {
  const result = await patch<{ columnIds: string[] }, Column[]>(
    `${boardsApiUrl}/${id}${columnsApiUrl}/reorder`,
    body,
  )
  return result
}
