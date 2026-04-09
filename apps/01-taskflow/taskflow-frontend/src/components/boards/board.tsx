import ColumnView from '@/components/columns/column'
import type { Board } from '@/types/board'
import type { Column } from '@/types/column'
import type { Task } from '@/types/task'

interface BoardDetailProps {
  board: Board
  columns: Column[]
  tasks: Task[]
}

export default function BoardView({ board, columns, tasks }: BoardDetailProps) {
  return (
    <>
      <h1>{board.name}</h1>
      <p>ID: {board.id}</p>
      <p>Created at: {board.createdAt}</p>
      <p>Last updated: {board.updatedAt}</p>

      <div className="flex">
        {columns
          .toSorted((a, b) => a.position - b.position)
          .map((column) => {
            const columnTasks = tasks.filter((task) => task.columnId === column.id)

            return <ColumnView key={column.id} column={column} tasks={columnTasks} />
          })}
      </div>
    </>
  )
}
