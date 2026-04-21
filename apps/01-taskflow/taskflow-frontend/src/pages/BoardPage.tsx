import { getBoard, getBoardColumns, getBoardTasks } from '@/modules/boards/api'
import BoardView from '@/modules/boards/components/BoardView'
import { handleCreateColumn } from '@/modules/columns/actions'
import { handleCloneTask, handleCreateTask } from '@/modules/tasks/actions'
import { FilterSchema, type FilterType } from '@/shared/filter/schemas'
import { BadRequestError } from '@/shared/lib/errors/httpError'
import { data } from 'react-router'
import type { Route } from './+types/BoardPage'

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url)

  const filter: FilterType = FilterSchema.parse(Object.fromEntries(url.searchParams))

  const boardId = params.id

  const [board, columns, tasks] = await Promise.all([
    getBoard(boardId),
    getBoardColumns(boardId),
    getBoardTasks(boardId, filter),
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
    <main className="py-10">
      <BoardView board={board} columns={columns} tasks={tasks} />
    </main>
  )
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case 'create-column':
      return handleCreateColumn(formData, params.id)
    case 'create-task':
      return handleCreateTask(formData)
    case 'clone-task':
      return handleCloneTask(formData)
    default:
      throw new BadRequestError('Wrong intent.')
  }
}
