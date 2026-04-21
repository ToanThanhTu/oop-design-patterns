import { Button } from '@/components/ui/button'
import type { ActionResult } from '@/lib/errors/types'
import type { Board } from '@/types/board'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'

interface CreateBoardFormProps {
  setShowCreateBoardModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateBoardForm({ setShowCreateBoardModal }: CreateBoardFormProps) {
  const fetcher = useFetcher<ActionResult<Board>>()
  const result = fetcher.data

  const errors = result && !result.ok ? result.error : undefined

  const isSubmitting = fetcher.state !== 'idle'

  useEffect(() => {
    if (fetcher.state === 'idle' && result?.ok) {
      setShowCreateBoardModal(false)
    }
  }, [fetcher.state, result, setShowCreateBoardModal])

  return (
    <fetcher.Form method="post" className="flex flex-col gap-4">
      <h2>Create a new Board</h2>

      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" className="p-1 shadow-md border border-gray-100" />
      {errors?.formError && <div role="alert">{errors.formError}</div>}
      {errors?.fieldErrors?.name && <em>{errors.fieldErrors.name}</em>}

      {isSubmitting ? (
        <Button disabled>Submitting...</Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </fetcher.Form>
  )
}
