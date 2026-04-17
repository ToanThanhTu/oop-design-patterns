import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ActionResult } from '@/lib/errors/types'
import type { Task } from '@/types/task'
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
      <h2>Create a New {columnName} Task</h2>

      {errors?.formError && <div role="alert">{errors.formError}</div>}

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" name="title" placeholder="Enter task title" />

        {errors?.fieldErrors?.title && <FieldError>{errors.fieldErrors.title}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="type">Type</FieldLabel>
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

      <RadioGroup defaultValue="medium" name="priority">
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

        {errors?.fieldErrors?.priority && <FieldError>{errors.fieldErrors.priority}</FieldError>}
      </RadioGroup>

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
