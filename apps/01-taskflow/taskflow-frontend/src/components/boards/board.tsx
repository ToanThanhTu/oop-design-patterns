import ColumnView from '@/components/columns/column'
import CreateColumnForm from '@/components/form/createColumnForm'
import Modal from '@/components/modal/modal'
import { Button } from '@/components/ui/button'
import type { Board } from '@/types/board'
import type { Column } from '@/types/column'
import type { Task } from '@/types/task'
import { useState } from 'react'

interface BoardDetailProps {
  board: Board
  columns: Column[]
  tasks: Task[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BoardView({ board, columns, tasks }: BoardDetailProps) {
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false)

  const sortedColumns = columns.toSorted((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col gap-6">
      <header className="mx-auto w-full max-w-6xl flex flex-col gap-1 px-6">
        <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
        <p className="text-sm text-muted-foreground">
          Created {formatDate(board.createdAt)} · Updated {formatDate(board.updatedAt)}
        </p>
      </header>

      <div>
        <Button onClick={() => setShowCreateColumnModal(true)}>Create Column</Button>
      </div>

      {showCreateColumnModal && (
        <Modal close={setShowCreateColumnModal}>
          <CreateColumnForm setShowCreateColumnModal={setShowCreateColumnModal} />
        </Modal>
      )}

      <div className="flex gap-4 overflow-x-auto px-6 pb-6">
        {sortedColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.columnId === column.id)
          return <ColumnView key={column.id} column={column} tasks={columnTasks} />
        })}
      </div>
    </div>
  )
}
