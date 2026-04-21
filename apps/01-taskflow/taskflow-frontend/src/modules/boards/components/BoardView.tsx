import ColumnView from '@/components/columns/column'
import { FilterBar } from '@/components/filter/filterBar'
import CreateColumnForm from '@/components/form/createColumnForm'
import Modal from '@/components/modal/modal'
import { TaskDetails } from '@/components/tasks/taskDetails'
import { Button } from '@/components/ui/button'
import type { Board } from '@/types/board'
import type { Column } from '@/types/column'
import type { Task } from '@/types/task'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'

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
  const [searchParams, setSearchParams] = useSearchParams()

  const sortedColumns = columns.toSorted((a, b) => a.position - b.position)

  // Open task details modal if task param exists
  const taskId = searchParams.get('task')
  const taskToOpen = tasks.find((task) => task.id === taskId)

  function closeTaskDetails() {
    setSearchParams((prev) => {
      prev.delete('task')
      return prev
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="mx-auto w-full max-w-6xl flex flex-col gap-3 px-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(board.createdAt)} · Updated {formatDate(board.updatedAt)}
          </p>
        </div>
        <Button onClick={() => setShowCreateColumnModal(true)} className="sm:self-center">
          <PlusIcon className="size-4" />
          Create Column
        </Button>
      </header>

      {showCreateColumnModal && (
        <Modal close={setShowCreateColumnModal}>
          <CreateColumnForm setShowCreateColumnModal={setShowCreateColumnModal} />
        </Modal>
      )}

      <FilterBar />

      <div className="flex gap-4 overflow-x-auto px-6 pb-6">
        {sortedColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.columnId === column.id)
          return <ColumnView key={column.id} column={column} tasks={columnTasks} />
        })}
      </div>

      {taskToOpen && (
        <Modal close={closeTaskDetails}>
          <TaskDetails task={taskToOpen} close={closeTaskDetails} />
        </Modal>
      )}
    </div>
  )
}
