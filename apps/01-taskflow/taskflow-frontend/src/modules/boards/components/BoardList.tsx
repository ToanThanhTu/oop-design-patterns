import type { Board } from '@/modules/boards/entities/board'
import { Link } from 'react-router'

interface BoardListProps {
  boards: Board[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function BoardList({ boards }: BoardListProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <li key={board.id}>
          <Link
            to={`/boards/${board.id}`}
            className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="text-lg font-semibold tracking-tight group-hover:underline">
              {board.name}
            </h3>
            <p className="text-xs text-muted-foreground">Updated {formatDate(board.updatedAt)}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
