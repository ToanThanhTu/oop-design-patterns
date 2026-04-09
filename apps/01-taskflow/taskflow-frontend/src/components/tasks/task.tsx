import type { Task } from '@/types/task'

interface TaskProps {
  task: Task
}

export default function TaskTile({ task }: TaskProps) {
  return (
    <div className="border-black border p-2">
      <h4>{task.title}</h4>
      {task.dueDate && <p>Due: {task.dueDate}</p>}
      {task.assignee && <p>{task.assignee}</p>}
      <p>{task.priority}</p>
      <p>{task.type}</p>
    </div>
  )
}
