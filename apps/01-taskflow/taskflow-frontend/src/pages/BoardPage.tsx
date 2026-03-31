import type { Route } from '.react-router/types/src/pages/+types/BoardPage'

export async function loader({ params }: Route.LoaderArgs) {
  const board = await Promise.resolve({ id: params.id })

  return board
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return <h1>Board ID: {loaderData.id}</h1>
}
