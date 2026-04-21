import RequiredIndicator from '@/shared/components/forms/RequiredIndicator'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import type { ActionResult } from '@/shared/lib/errors/types'
import type { Task } from '@/modules/tasks/entities/task'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'

interface CreateTaskFormProps {
  columnId: string
  columnName: string
  setShowCreateTaskModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTaskForm({
  columnId,
  columnName,
  setShowCreateTaskModal,
}: CreateTaskFormProps) {
  const fetcher = useFetcher<ActionResult<Task>>()
  const result = fetcher.data

  const errors = result && !result.ok ? result.error : undefined
  const isSubmitting = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.state === 'idle' && result?.ok) {
      setShowCreateTaskModal(false)
    }
  }, [fetcher.state, result, setShowCreateTaskModal])

  return (
    <fetcher.Form method="post" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create a New {columnName} Task</h2>

      {errors?.formError && (
        <div role="alert" className="text-destructive text-sm">
          {errors.formError}
        </div>
      )}

      <Field>
        <FieldLabel htmlFor="title">
          Title <RequiredIndicator />
        </FieldLabel>
        <Input id="title" name="title" placeholder="Enter task title" />
        {errors?.fieldErrors?.title && <FieldError>{errors.fieldErrors.title}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="type">
            Type <RequiredIndicator />
          </FieldLabel>
          <Select name="type">
            <SelectTrigger id="type">
              <SelectValue placeholder="Select a task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors?.fieldErrors?.type && <FieldError>{errors.fieldErrors.type}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>
            Priority <RequiredIndicator />
          </FieldLabel>
          <RadioGroup defaultValue="medium" name="priority" className="flex gap-4">
            <Field orientation="horizontal">
              <RadioGroupItem value="high" id="high-priority" />
              <FieldLabel htmlFor="high-priority">High</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="medium" id="medium-priority" />
              <FieldLabel htmlFor="medium-priority">Medium</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="low" id="low-priority" />
              <FieldLabel htmlFor="low-priority">Low</FieldLabel>
            </Field>
          </RadioGroup>
          {errors?.fieldErrors?.priority && (
            <FieldError>{errors.fieldErrors.priority}</FieldError>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
          <Input id="assignee" name="assignee" placeholder="Enter assignee name" />
          {errors?.fieldErrors?.assignee && (
            <FieldError>{errors.fieldErrors.assignee}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
          <Input id="dueDate" name="dueDate" type="date" />
          {errors?.fieldErrors?.dueDate && <FieldError>{errors.fieldErrors.dueDate}</FieldError>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Describe the task..."
        />
        {errors?.fieldErrors?.description && (
          <FieldError>{errors.fieldErrors.description}</FieldError>
        )}
      </Field>

      <Field orientation="horizontal">
        <Checkbox id="isTemplate" name="isTemplate" />
        <FieldLabel htmlFor="isTemplate">Save as template</FieldLabel>
      </Field>

      <input type="hidden" name="columnId" value={columnId} />
      <input type="hidden" name="intent" value="create-task" />

      {isSubmitting ? (
        <Button disabled>Submitting...</Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </fetcher.Form>
  )
}
