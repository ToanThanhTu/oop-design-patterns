import { getBoards } from '@/api/boardApi'
import { BoardList } from '@/components/boards/boards'
import type { Route } from './+types/HomePage'

export async function loader() {
  const boards = await getBoards()
  return boards ?? []
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const boards = loaderData

  return (
    <main>
      <h1 className="text-4xl">Taskflow</h1>
      {boards.length > 0 ? <BoardList boards={boards} /> : <p>No Board Found</p>}
    </main>
  )
}
