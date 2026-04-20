import { getTaskLabels } from '@/api/taskApi'
import type { Route } from './+types/api.tasks.$id.labels'

// Task resource route: fetcher load labels
export async function loader({ params }: Route.LoaderArgs) {
  const labels = await getTaskLabels(params.id)
  return labels
}
