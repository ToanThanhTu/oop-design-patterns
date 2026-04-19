import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Priority, Task, TaskType } from '@/types/task'
import { Link } from 'react-router'

interface TaskProps {
  task: Task
}

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
}

const typeStyles: Record<TaskType, string> = {
  bug: 'bg-orange-100 text-orange-700',
  feature: 'bg-purple-100 text-purple-700',
  story: 'bg-green-100 text-green-700',
  task: 'bg-slate-100 text-slate-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TaskTile({ task }: TaskProps) {
  return (
    <div className="bg-card rounded-md shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2 relative">
      <Link to={`?task=${task.id}`}>
        <h4 className="text-sm font-medium">{task.title}</h4>

        <div className="flex gap-1 flex-wrap">
          <span
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide',
              typeStyles[task.type],
            )}
          >
            {task.type}
          </span>
          <span
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide',
              priorityStyles[task.priority],
            )}
          >
            {task.priority}
          </span>
        </div>

        {(task.assignee || task.dueDate) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {task.assignee ? (
              <div
                className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center"
                title={task.assignee}
              >
                {initials(task.assignee)}
              </div>
            ) : (
              <span />
            )}
            {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
          </div>
        )}
      </Link>

      <Button variant="outline" className="absolute top-2 right-2">
        Clone
      </Button>
    </div>
  )
}
