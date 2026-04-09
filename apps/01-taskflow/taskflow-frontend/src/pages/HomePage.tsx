import { createBoard, getBoards } from '@/api/boardApi'
import { BoardList } from '@/components/boards/boards'
import type { Route } from './+types/HomePage'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CreateBoardForm from '@/components/form/createBoardForm'
import Modal from '@/components/modal/modal'
import { data } from 'react-router'
import { toActionError } from '@/lib/errors/toActionError'
import { CreateBoardSchema } from '@/schemas/boardSchemas'
import { zodErrorToActionError } from '@/lib/errors/zodErrorToActionError'

export async function loader() {
  const boards = await getBoards()
  return boards ?? []
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)

  const boards = loaderData

  return (
    <main>
      <h1 className="text-4xl">Taskflow</h1>

      <Button onClick={() => setShowCreateBoardModal(true)}>Create new Board</Button>

      {showCreateBoardModal && (
        <Modal close={setShowCreateBoardModal}>
          <CreateBoardForm setShowCreateBoardModal={setShowCreateBoardModal} />
        </Modal>
      )}

      {boards.length > 0 ? <BoardList boards={boards} /> : <p>No Board Found</p>}
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
