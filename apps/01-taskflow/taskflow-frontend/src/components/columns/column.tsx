import TaskTile from '@/components/tasks/task'
import type { Column } from '@/types/column'
import type { Task } from '@/types/task'

interface ColumnProps {
  column: Column
  tasks: Task[]
}

export default function ColumnView({ column, tasks }: ColumnProps) {
  return (
    <div className="border border-black">
      <h3 className="border border-black">{column.name}</h3>

      <div className="flex flex-col gap-4">
        {tasks
          .toSorted((a, b) => a.position - b.position)
          .map((task) => (
            <TaskTile task={task} key={task.id} />
          ))}
      </div>
    </div>
  )
}
