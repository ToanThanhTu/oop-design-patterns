import { getBoards } from '@/modules/boards/api'
import { handleCreateBoard } from '@/modules/boards/actions'
import { BoardList } from '@/modules/boards/components/BoardList'
import CreateBoardForm from '@/modules/boards/components/CreateBoardForm'
import Modal from '@/shared/components/modal/Modal'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'
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
  return handleCreateBoard(formData)
}
