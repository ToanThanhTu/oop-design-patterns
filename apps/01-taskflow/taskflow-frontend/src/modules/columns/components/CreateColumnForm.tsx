import { Button } from '@/shared/components/ui/button'
import type { ActionResult } from '@/shared/lib/errors/types'
import type { Column } from '@/modules/columns/entities/column'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'

interface CreateColumnFormProps {
  setShowCreateColumnModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateColumnForm({ setShowCreateColumnModal }: CreateColumnFormProps) {
  const fetcher = useFetcher<ActionResult<Column>>()
  const result = fetcher.data

  const errors = result && !result.ok ? result.error : undefined

  const isSubmitting = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.state === 'idle' && result?.ok) {
      setShowCreateColumnModal(false)
    }
  }, [fetcher.state, result, setShowCreateColumnModal])

  return (
    <fetcher.Form method="post" className="flex flex-col gap-4">
      <h2>Create a new Column</h2>

      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" className="p-1 shadow-md border border-gray-100" />
      {errors?.formError && <div role="alert">{errors.formError}</div>}
      {errors?.fieldErrors?.name && <em>{errors.fieldErrors.name}</em>}

      <input type="hidden" name="intent" value="create-column" />

      {isSubmitting ? (
        <Button disabled>Submitting...</Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </fetcher.Form>
  )
}
