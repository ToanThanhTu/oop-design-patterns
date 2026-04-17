import { createBoard, getBoards } from '@/api/boardApi'
import { BoardList } from '@/components/boards/boards'
import CreateBoardForm from '@/components/form/createBoardForm'
import Modal from '@/components/modal/modal'
import { Button } from '@/components/ui/button'
import { toActionError } from '@/lib/errors/toActionError'
import { zodErrorToActionError } from '@/lib/errors/zodErrorToActionError'
import { CreateBoardSchema } from '@/schemas/boardSchemas'
import { useState } from 'react'
import { data } from 'react-router'
import type { Route } from './+types/HomePage'

export async function loader() {
  const boards = await getBoards()
  return boards ?? []
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)
  const boards = loaderData

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-sm text-muted-foreground">
            {boards.length === 0
              ? 'Create your first board to get started'
              : `${boards.length} ${boards.length === 1 ? 'board' : 'boards'}`}
          </p>
        </div>

        <Button onClick={() => setShowCreateBoardModal(true)}>Create Board</Button>
      </header>

      {showCreateBoardModal && (
        <Modal close={setShowCreateBoardModal}>
          <CreateBoardForm setShowCreateBoardModal={setShowCreateBoardModal} />
        </Modal>
      )}

      {boards.length > 0 ? (
        <BoardList boards={boards} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">No boards yet</p>
          <Button variant="outline" onClick={() => setShowCreateBoardModal(true)}>
            Create your first board
          </Button>
        </div>
      )}
    </main>
  )
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const parseResult = CreateBoardSchema.safeParse(Object.fromEntries(formData))

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
    const createdBoard = await createBoard(parseResult.data)
    return data({ ok: true, data: createdBoard })
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
