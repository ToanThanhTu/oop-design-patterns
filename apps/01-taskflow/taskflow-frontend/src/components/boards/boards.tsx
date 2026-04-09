import type { Board } from '@/types/board'
import { Link } from 'react-router'

interface BoardListProps {
  boards: Board[]
}

export function BoardList({ boards }: BoardListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {boards.map((board) => (
        <li key={board.id}>
          <Link to={`/boards/${board.id}`}>{board.name}</Link>
        </li>
      ))}
    </ul>
  )
}
