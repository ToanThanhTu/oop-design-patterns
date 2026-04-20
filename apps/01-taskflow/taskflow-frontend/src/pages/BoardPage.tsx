import { getBoard, getBoardColumns, getBoardTasks } from '@/api/boardApi'
import { createColumn } from '@/api/columnApi'
import { cloneTask, createTask } from '@/api/taskApi'
import BoardView from '@/components/boards/board'
import { BadRequestError } from '@/lib/errors/httpError'
import { toActionError } from '@/lib/errors/toActionError'
import { zodErrorToActionError } from '@/lib/errors/zodErrorToActionError'
import { CreateColumnSchema } from '@/schemas/columnSchemas'
import { CloneTaskSchema, CreateTaskSchema } from '@/schemas/taskSchemas'
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
      return handleCreateColumn(formData, params)
    case 'create-task':
      return handleCreateTask(formData)
    case 'clone-task':
      return handleCloneTask(formData)
    default:
      throw new BadRequestError('Wrong intent.')
  }
}

async function handleCreateColumn(formData: FormData, params: { id: string }) {
  const boardId = params.id
  const parseResult = CreateColumnSchema.safeParse(Object.fromEntries(formData))

  if (!parseResult.success) {
    return data(
      {
        ok: false,
        error: zodErrorToActionError(parseResult.error),
      },
      { status: 400 },
    )
  }

  try {
    const createdColumn = await createColumn(boardId, parseResult.data)
    return data({ ok: true, data: createdColumn })
  } catch (error: unknown) {
    return data(
      {
        ok: false,
        error: toActionError(error),
      },
      { status: 500 },
    )
  }
}

async function handleCreateTask(formData: FormData) {
  const parseResult = CreateTaskSchema.safeParse(Object.fromEntries(formData))

  if (!parseResult.success) {
    return data(
      {
        ok: false,
        error: zodErrorToActionError(parseResult.error),
      },
      { status: 400 },
    )
  }

  try {
    const createdTask = await createTask(parseResult.data.columnId, parseResult.data)
    return data({ ok: true, data: createdTask })
  } catch (error: unknown) {
    return data(
      {
        ok: false,
        error: toActionError(error),
      },
      { status: 500 },
    )
  }
}

async function handleCloneTask(formData: FormData) {
  const parseResult = CloneTaskSchema.safeParse(Object.fromEntries(formData))

  if (!parseResult.success) {
    return data(
      {
        ok: false,
        error: zodErrorToActionError(parseResult.error),
      },
      { status: 400 },
    )
  }

  try {
    const clonedTask = await cloneTask(parseResult.data.id)
    return data({ ok: true, data: clonedTask })
  } catch (error: unknown) {
    return data(
      {
        ok: false,
        error: toActionError(error),
      },
      { status: 500 },
    )
  }
}
