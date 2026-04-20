import { getTaskSubtasks } from '@/api/taskApi'
import type { Route } from './+types/api.tasks.$id.subtasks'

// Task resource route: fetcher load subtasks
export async function loader({ params }: Route.LoaderArgs) {
  const subtasks = await getTaskSubtasks(params.id)
  return subtasks
}
