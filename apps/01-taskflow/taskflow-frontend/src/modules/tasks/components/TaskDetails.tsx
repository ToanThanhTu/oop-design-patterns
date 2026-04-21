import { updateSubtask } from '@/modules/subtasks/api'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import type { ActionResult } from '@/shared/lib/errors/types'
import { cn } from '@/shared/lib/utils'
import type { Label } from '@/modules/labels/entities/label'
import type { Subtask } from '@/modules/subtasks/entities/subtask'
import type { PriorityType, TaskTypeType } from '@/modules/tasks/schemas'
import type { Task } from '@/modules/tasks/entities/task'
import { useEffect, useOptimistic, useTransition } from 'react'
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
  const subtaskFetcher = useFetcher<Subtask[]>()
  const labelFetcher = useFetcher<Label[]>()
  const cloneFetcher = useFetcher<ActionResult<Task>>()

  const [isPending, startTransition] = useTransition()

  const cloneResult = cloneFetcher.data
  const isCloning = cloneFetcher.state !== 'idle'

  useEffect(() => {
    if (cloneFetcher.state === 'idle' && cloneResult?.ok) {
      close()
    }
  }, [cloneFetcher.state, cloneResult, close])

  function handleClone() {
    cloneFetcher.submit({ intent: 'clone-task', id: task.id }, { method: 'POST' })
  }

  const [optimisticSubtasks, addOptimisticSubtasks] = useOptimistic(
    subtaskFetcher.data ?? [],
    (current: Subtask[], toggleId: string) =>
      current.map((s) => (s.id === toggleId ? { ...s, isComplete: !s.isComplete } : s)),
  )

  useEffect(() => {
    if (subtaskFetcher.state === 'idle' && !subtaskFetcher.data) {
      subtaskFetcher.load(`/api/tasks/${task.id}/subtasks`)
    }

    if (labelFetcher.state === 'idle' && !labelFetcher.data) {
      labelFetcher.load(`/api/tasks/${task.id}/labels`)
    }
  }, [subtaskFetcher, labelFetcher, task.id])

  const sortedSubtasks = [...optimisticSubtasks].sort((a, b) => a.position - b.position)
  const completedSubtaskCount = optimisticSubtasks.filter((s) => s.isComplete).length
  const totalSubtaskCount = optimisticSubtasks.length
  const subtaskProgress =
    totalSubtaskCount > 0 ? Math.round((completedSubtaskCount / totalSubtaskCount) * 100) : 0
  const isLoadingSubtasks = subtaskFetcher.state === 'loading' && !subtaskFetcher.data

  const labels = labelFetcher.data ?? []
  const isLoadingLabels = labelFetcher.state === 'loading' && !labelFetcher.data

  function handleToggleSubtask(subtask: Subtask) {
    startTransition(async () => {
      addOptimisticSubtasks(subtask.id)
      try {
        await updateSubtask(subtask.id, { isComplete: !subtask.isComplete })
        subtaskFetcher.load(`/api/tasks/${task.id}/subtasks`)
      } catch {
        // On failure, the transition ends and optimistic state auto-reverts
      }
    })
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

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Subtasks
          </h3>
          {totalSubtaskCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedSubtaskCount} / {totalSubtaskCount} completed
            </span>
          )}
        </div>

        {totalSubtaskCount > 0 && (
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        )}

        {isLoadingSubtasks ? (
          <p className="text-sm text-muted-foreground italic">Loading subtasks…</p>
        ) : totalSubtaskCount === 0 ? (
          <p className="text-sm text-muted-foreground italic">No subtasks</p>
        ) : (
          <ul className={cn('flex flex-col gap-1', isPending && 'opacity-70')}>
            {sortedSubtasks.map((subtask) => (
              <li
                key={subtask.id}
                className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`subtask-${subtask.id}`}
                  checked={subtask.isComplete}
                  onCheckedChange={() => handleToggleSubtask(subtask)}
                />
                <label
                  htmlFor={`subtask-${subtask.id}`}
                  className={cn(
                    'text-sm flex-1 cursor-pointer select-none',
                    subtask.isComplete && 'line-through text-muted-foreground',
                  )}
                >
                  {subtask.title}
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Labels
        </h3>
        {isLoadingLabels ? (
          <p className="text-sm text-muted-foreground italic">Loading labels…</p>
        ) : labels.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No labels</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {labels.map((label) => (
              <li key={label.id}>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${label.color}20`,
                    borderColor: `${label.color}40`,
                    color: label.color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      <footer className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClone} disabled={isCloning}>
          {isCloning ? 'Cloning…' : 'Clone'}
        </Button>
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </footer>
    </div>
  )
}
