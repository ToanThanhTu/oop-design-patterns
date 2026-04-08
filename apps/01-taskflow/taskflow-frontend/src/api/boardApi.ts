import { del, get, patch, post, put } from '@/api/client'

const boardsApiUrl = import.meta.env.VITE_BOARDS_API_URL || '/boards'
const snapshotsApiUrl = import.meta.env.VITE_SNAPSHOTS_API_URL || '/snapshots'
const columnsApiUrl = import.meta.env.VITE_COLUMNS_API_URL || '/columns'
const tasksApiUrl = import.meta.env.VITE_TASKS_API_URL || '/tasks'

export async function getBoards() {
  const result = await get(boardsApiUrl)
  return result
}

export async function getBoard(id: string) {
  const result = await get(`${boardsApiUrl}/:${id}`)
  return result
}

export async function createBoard(body: object) {
  const result = await post(boardsApiUrl, body)
  return result
}

export async function deleteBoard(id: string) {
  const result = await del(`${boardsApiUrl}/:${id}`)
  return result
}

export async function updateBoard(id: string, body: object) {
  const result = await put(`${boardsApiUrl}/:${id}`, body)
  return result
}

export async function getBoardSnapshots(id: string) {
  const result = await get(`${boardsApiUrl}/:${id}${snapshotsApiUrl}`)
  return result
}

export async function createBoardSnapshot(id: string, body: object) {
  const result = await post(`${boardsApiUrl}/:${id}${snapshotsApiUrl}`, body)
  return result
}

export async function undoBoardSnapshot(id: string) {
  const result = await post(`${boardsApiUrl}/:${id}/undo`)
  return result
}

export async function redoBoardSnapshot(id: string) {
  const result = await post(`${boardsApiUrl}/:${id}/redo`)
  return result
}

export async function getBoardTasks(id: string, query: object) {
  const result = await get(`${boardsApiUrl}/:${id}${tasksApiUrl}`)
  return result
}

export async function getBoardColumns(id: string) {
  const result = await get(`${boardsApiUrl}/:${id}${columnsApiUrl}`)
  return result
}

export async function reorderColumns(id: string, body: object) {
  const result = await patch(`${boardsApiUrl}/:${id}${columnsApiUrl}/reorder`, body)
  return result
}
