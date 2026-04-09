import { getBoard, getBoardColumns, getBoardTasks } from '@/api/boardApi'
import BoardView from '@/components/boards/board'
import { data } from 'react-router'
import type { Route } from './+types/BoardPage'

export async function loader({ params }: Route.LoaderArgs) {
  const boardId = params.id

  const [board, columns, tasks] = await Promise.all([
    getBoard(boardId),
    getBoardColumns(boardId),
    getBoardTasks(boardId, {}),
  ])

  if (!board) {
    throw data('Board Not Found', { status: 404 })
  }

  if (!columns) {
    throw data('Columns Not Found', { status: 404 })
  }

  if (!tasks) {
    throw data('Tasks Not Found', { status: 404 })
  }

  return { board, columns, tasks }
}

export default function BoardPage({ loaderData }: Route.ComponentProps) {
  const { board, columns, tasks } = loaderData

  return (
    <main className="border border-black p-12">
      <BoardView board={board} columns={columns} tasks={tasks} />
    </main>
  )
}
