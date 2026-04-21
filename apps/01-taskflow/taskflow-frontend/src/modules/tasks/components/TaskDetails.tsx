import TaskLabelList from '@/modules/labels/components/TaskLabelList'
import SubtaskList from '@/modules/subtasks/components/SubtaskList'
import type { Task } from '@/modules/tasks/entities/task'
import EditTaskForm from '@/modules/tasks/components/EditTaskForm'
import type { PriorityType, TaskTypeType } from '@/modules/tasks/schemas'
import ConfirmModal from '@/shared/components/modal/ConfirmModal'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import type { ActionResult } from '@/shared/lib/errors/types'
import { cn } from '@/shared/lib/utils'
import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'

interface TaskDetailsProps {
  task: Task
  close: () => void
}

const priorityStyles: Record<PriorityType, string> = {
  high: 'bg-red-100 text-red-700',
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
}

const typeStyles: Record<TaskTypeType, string> = {
  bug: 'bg-orange-100 text-orange-700',
  feature: 'bg-purple-100 text-purple-700',
  story: 'bg-green-100 text-green-700',
  task: 'bg-slate-100 text-slate-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TaskDetails({ task, close }: TaskDetailsProps) {
  const cloneFetcher = useFetcher<ActionResult<Task>>()
  const deleteFetcher = useFetcher<ActionResult<void>>()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditDirty, setIsEditDirty] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const cloneResult = cloneFetcher.data
  const isCloning = cloneFetcher.state !== 'idle'

  const deleteResult = deleteFetcher.data
  const isDeleting = deleteFetcher.state !== 'idle'

  useEffect(() => {
    if (cloneFetcher.state === 'idle' && cloneResult?.ok) {
      close()
    }
  }, [cloneFetcher.state, cloneResult, close])

  useEffect(() => {
    if (deleteFetcher.state === 'idle' && deleteResult?.ok) {
      // close() unmounts this component, so showDeleteConfirm doesn't need resetting
      close()
    }
  }, [deleteFetcher.state, deleteResult, close])

  function handleClone() {
    cloneFetcher.submit({ intent: 'clone-task', id: task.id }, { method: 'POST' })
  }

  function handleConfirmDelete() {
    deleteFetcher.submit({ intent: 'delete-task', id: task.id }, { method: 'POST' })
  }

  function handleRequestCancelEdit() {
    if (isEditDirty) {
      setShowDiscardConfirm(true)
    } else {
      setIsEditing(false)
    }
  }

  function handleConfirmDiscard() {
    setIsEditing(false)
    setIsEditDirty(false)
    setShowDiscardConfirm(false)
  }

  function handleEditSuccess() {
    setIsEditing(false)
    setIsEditDirty(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 w-130 max-w-full">
        <EditTaskForm
          task={task}
          onCancel={handleRequestCancelEdit}
          onDirtyChange={setIsEditDirty}
          onSuccess={handleEditSuccess}
        />

        {showDiscardConfirm && (
          <ConfirmModal
            title="Discard changes?"
            message="You have unsaved changes. Are you sure you want to discard them?"
            confirmLabel="Discard"
            cancelLabel="Keep editing"
            variant="destructive"
            close={() => setShowDiscardConfirm(false)}
            onConfirm={handleConfirmDiscard}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-130 max-w-full">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight pr-8">{task.title}</h2>

        <div className="flex flex-wrap gap-1.5">
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
          {task.isTemplate && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide bg-yellow-100 text-yellow-700">
              Template
            </span>
          )}
        </div>
      </header>

      <Separator />

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Assignee
          </dt>
          <dd>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                  {initials(task.assignee)}
                </div>
                <span>{task.assignee}</span>
              </div>
            ) : (
              <span className="text-muted-foreground italic">Unassigned</span>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Due Date
          </dt>
          <dd>
            {task.dueDate ? (
              formatDate(task.dueDate)
            ) : (
              <span className="text-muted-foreground italic">No due date</span>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Created
          </dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Updated
          </dt>
          <dd>{formatDate(task.updatedAt)}</dd>
        </div>
      </dl>

      <Separator />

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Description
        </h3>
        {task.description ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{task.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}
      </section>

      <Separator />

      <SubtaskList taskId={task.id} />

      <Separator />

      <TaskLabelList taskId={task.id} />

      <Separator />

      <footer className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClone} disabled={isCloning || isDeleting}>
          {isCloning ? 'Cloning…' : 'Clone'}
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isDeleting}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </footer>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete this task?"
          message={`"${task.title}" will be permanently removed along with its subtasks and label associations.`}
          confirmLabel="Delete"
          variant="destructive"
          isPending={isDeleting}
          close={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
