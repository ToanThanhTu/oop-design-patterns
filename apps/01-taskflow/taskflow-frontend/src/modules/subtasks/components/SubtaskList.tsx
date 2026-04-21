import { deleteSubtask, updateSubtask } from '@/modules/subtasks/api'
import type { Subtask } from '@/modules/subtasks/entities/subtask'
import { createTaskSubtask } from '@/modules/tasks/api'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { useFetcher } from 'react-router'

type SubtaskAction =
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'create'; subtask: Subtask }
  | { type: 'edit'; id: string; title: string }

interface SubtaskListProps {
  taskId: string
}

export default function SubtaskList({ taskId }: SubtaskListProps) {
  const subtaskFetcher = useFetcher<Subtask[]>()
  const [isPending, startTransition] = useTransition()

  const [optimisticSubtasks, dispatchOptimisticSubtask] = useOptimistic(
    subtaskFetcher.data ?? [],
    (current: Subtask[], action: SubtaskAction) => {
      switch (action.type) {
        case 'toggle':
          return current.map((s) =>
            s.id === action.id ? { ...s, isComplete: !s.isComplete } : s,
          )
        case 'delete':
          return current.filter((s) => s.id !== action.id)
        case 'create':
          return [...current, action.subtask]
        case 'edit':
          return current.map((s) => (s.id === action.id ? { ...s, title: action.title } : s))
      }
    },
  )

  useEffect(() => {
    if (subtaskFetcher.state === 'idle' && !subtaskFetcher.data) {
      subtaskFetcher.load(`/api/tasks/${taskId}/subtasks`)
    }
  }, [subtaskFetcher, taskId])

  const sortedSubtasks = [...optimisticSubtasks].sort((a, b) => a.position - b.position)
  const completedCount = optimisticSubtasks.filter((s) => s.isComplete).length
  const totalCount = optimisticSubtasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isLoading = subtaskFetcher.state === 'loading' && !subtaskFetcher.data

  function handleToggleSubtask(subtask: Subtask) {
    startTransition(async () => {
      dispatchOptimisticSubtask({ type: 'toggle', id: subtask.id })
      try {
        await updateSubtask(subtask.id, { isComplete: !subtask.isComplete })
        subtaskFetcher.load(`/api/tasks/${taskId}/subtasks`)
      } catch {
        // auto-revert
      }
    })
  }

  function handleDeleteSubtask(subtaskId: string) {
    startTransition(async () => {
      dispatchOptimisticSubtask({ type: 'delete', id: subtaskId })
      try {
        await deleteSubtask(subtaskId)
        subtaskFetcher.load(`/api/tasks/${taskId}/subtasks`)
      } catch {
        // auto-revert
      }
    })
  }

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  function handleCreateSubtask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newSubtaskTitle.trim()
    if (!title) return

    setNewSubtaskTitle('')

    const position = optimisticSubtasks.length

    startTransition(async () => {
      const optimistic: Subtask = {
        id: crypto.randomUUID(),
        isComplete: false,
        position,
        taskId,
        title,
      }
      dispatchOptimisticSubtask({ type: 'create', subtask: optimistic })
      try {
        await createTaskSubtask(taskId, { isComplete: false, position, title })
        subtaskFetcher.load(`/api/tasks/${taskId}/subtasks`)
      } catch {
        // auto-revert
      }
    })
  }

  const [editingSubtask, setEditingSubtask] = useState<{
    draftTitle: string
    id: string
  } | null>(null)

  function startEditingSubtask(subtask: Subtask) {
    setEditingSubtask({ draftTitle: subtask.title, id: subtask.id })
  }

  function cancelEditingSubtask() {
    setEditingSubtask(null)
  }

  function commitEditingSubtask() {
    if (!editingSubtask) return
    const { draftTitle, id } = editingSubtask
    const trimmed = draftTitle.trim()
    const original = (subtaskFetcher.data ?? []).find((s) => s.id === id)

    if (!trimmed || trimmed === original?.title) {
      setEditingSubtask(null)
      return
    }

    setEditingSubtask(null)

    startTransition(async () => {
      dispatchOptimisticSubtask({ type: 'edit', id, title: trimmed })
      try {
        await updateSubtask(id, { title: trimmed })
        subtaskFetcher.load(`/api/tasks/${taskId}/subtasks`)
      } catch {
        // auto-revert
      }
    })
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Subtasks
        </h3>
        {totalCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {completedCount} / {totalCount} completed
          </span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground italic">Loading subtasks…</p>
      ) : totalCount === 0 ? (
        <p className="text-sm text-muted-foreground italic">No subtasks</p>
      ) : (
        <ul className={cn('flex flex-col gap-1', isPending && 'opacity-70')}>
          {sortedSubtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`subtask-${subtask.id}`}
                checked={subtask.isComplete}
                onCheckedChange={() => handleToggleSubtask(subtask)}
              />
              {editingSubtask?.id === subtask.id ? (
                <Input
                  autoFocus
                  value={editingSubtask.draftTitle}
                  onChange={(e) =>
                    setEditingSubtask({
                      ...editingSubtask,
                      draftTitle: e.target.value,
                    })
                  }
                  onBlur={commitEditingSubtask}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      commitEditingSubtask()
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      cancelEditingSubtask()
                    }
                  }}
                  className="h-7 text-sm flex-1"
                />
              ) : (
                <span
                  onClick={() => startEditingSubtask(subtask)}
                  className={cn(
                    'text-sm flex-1 cursor-text select-none rounded px-1 -mx-1 hover:bg-muted/70',
                    subtask.isComplete && 'line-through text-muted-foreground',
                  )}
                >
                  {subtask.title}
                </span>
              )}
              <Button
                aria-label="Delete subtask"
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteSubtask(subtask.id)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreateSubtask} className="flex gap-2">
        <Input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a subtask…"
          className="h-8 text-sm"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={isPending || !newSubtaskTitle.trim()}
        >
          Add
        </Button>
      </form>
    </section>
  )
}
