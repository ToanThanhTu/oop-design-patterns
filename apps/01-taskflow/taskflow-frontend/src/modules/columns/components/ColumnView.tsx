import CreateTaskForm from '@/modules/tasks/components/CreateTaskForm'
import Modal from '@/shared/components/modal/Modal'
import TaskTile from '@/modules/tasks/components/TaskTile'
import { Button } from '@/shared/components/ui/button'
import type { Column } from '@/modules/columns/entities/column'
import type { Task } from '@/modules/tasks/entities/task'
import { useState } from 'react'

interface ColumnProps {
  column: Column
  tasks: Task[]
}

export default function ColumnView({ column, tasks }: ColumnProps) {
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false)

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

        <Button onClick={() => setShowCreateTaskForm(true)}>Create Task</Button>
      </div>

      {showCreateTaskForm && (
        <Modal close={() => setShowCreateTaskForm(false)}>
          <CreateTaskForm
            columnId={column.id}
            columnName={column.name}
            setShowCreateTaskModal={setShowCreateTaskForm}
          />
        </Modal>
      )}
    </div>
  )
}
