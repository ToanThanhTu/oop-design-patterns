import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { ListFilterIcon, XIcon } from 'lucide-react'
import { Form, Link, useSearchParams, useSubmit } from 'react-router'

const inputClasses = cn(
  'h-9 rounded-md border border-input bg-transparent px-3 text-sm',
  'outline-none transition-colors',
  'placeholder:text-muted-foreground/60',
  'hover:border-ring/50',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

export function FilterBar() {
  const [searchParams] = useSearchParams()
  const submit = useSubmit()

  const currentPriority = searchParams.get('priority') ?? ''
  const currentType = searchParams.get('type') ?? ''
  const currentAssignee = searchParams.get('assignee') ?? ''
  const currentDueFrom = searchParams.get('dueDateFrom') ?? ''
  const currentDueTo = searchParams.get('dueDateTo') ?? ''
  const currentTask = searchParams.get('task') ?? ''

  const hasFilters = Boolean(
    currentPriority || currentType || currentAssignee || currentDueFrom || currentDueTo,
  )

  return (
    <Form
      method="get"
      onChange={(event) => submit(event.currentTarget, { replace: true })}
      className="mx-auto w-full max-w-6xl flex flex-wrap items-center gap-x-4 gap-y-3 px-6"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <ListFilterIcon className="size-4" />
        <span className="text-sm font-medium">Filter</span>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Priority</span>
        <select name="priority" defaultValue={currentPriority} className={inputClasses}>
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Type</span>
        <select name="type" defaultValue={currentType} className={inputClasses}>
          <option value="">All</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="story">Story</option>
          <option value="task">Task</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Assignee</span>
        <input
          type="text"
          name="assignee"
          defaultValue={currentAssignee}
          placeholder="Anyone"
          className={cn(inputClasses, 'w-36')}
        />
      </label>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Due</span>
        <input
          type="date"
          name="dueDateFrom"
          defaultValue={currentDueFrom}
          aria-label="Due date from"
          className={cn(inputClasses, 'w-40')}
        />
        <span className="text-muted-foreground">→</span>
        <input
          type="date"
          name="dueDateTo"
          defaultValue={currentDueTo}
          aria-label="Due date to"
          className={cn(inputClasses, 'w-40')}
        />
      </div>

      {currentTask && <input type="hidden" name="task" value={currentTask} />}

      {hasFilters && (
        <Button asChild variant="ghost" size="sm" className="ml-auto">
          <Link to={currentTask ? `?task=${currentTask}` : '?'} preventScrollReset replace>
            <XIcon className="size-4" />
            Clear
          </Link>
        </Button>
      )}
    </Form>
  )
}
