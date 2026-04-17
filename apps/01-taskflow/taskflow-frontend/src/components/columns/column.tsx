import TaskTile from '@/components/tasks/task'
import type { Column } from '@/types/column'
import type { Task } from '@/types/task'

interface ColumnProps {
  column: Column
  tasks: Task[]
}

export default function ColumnView({ column, tasks }: ColumnProps) {
  const sortedTasks = tasks.toSorted((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col gap-3 bg-muted rounded-lg p-4 min-w-75">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">{column.name}</h3>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </header>

      <div className="flex flex-col gap-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => <TaskTile task={task} key={task.id} />)
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No tasks yet</p>
        )}
      </div>
    </div>
  )
}
