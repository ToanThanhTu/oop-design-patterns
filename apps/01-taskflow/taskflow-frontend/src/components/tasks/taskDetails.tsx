import type { Task } from '@/types/task'

interface TaskDetailsProps {
  task: Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <div>
      <h2>Task {task.id}</h2>
    </div>
  )
}
