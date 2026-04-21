import { cloneTask, createTask } from '@/modules/tasks/api'
import { CloneTaskSchema, CreateTaskSchema } from '@/modules/tasks/schemas'
import { toActionError } from '@/shared/lib/errors/toActionError'
import { zodErrorToActionError } from '@/shared/lib/errors/zodErrorToActionError'
import { data } from 'react-router'

export async function handleCreateTask(formData: FormData) {
  const parseResult = CreateTaskSchema.safeParse(Object.fromEntries(formData))

  if (!parseResult.success) {
    return data(
      {
        ok: false,
        error: zodErrorToActionError(parseResult.error),
      },
      { status: 400 },
    )
  }

  try {
    const createdTask = await createTask(parseResult.data.columnId, parseResult.data)
    return data({ ok: true, data: createdTask })
  } catch (error: unknown) {
    return data(
      {
        ok: false,
        error: toActionError(error),
      },
      { status: 500 },
    )
  }
}

export async function handleCloneTask(formData: FormData) {
  const parseResult = CloneTaskSchema.safeParse(Object.fromEntries(formData))

  if (!parseResult.success) {
    return data(
      {
        ok: false,
        error: zodErrorToActionError(parseResult.error),
      },
      { status: 400 },
    )
  }

  try {
    const clonedTask = await cloneTask(parseResult.data.id)
    return data({ ok: true, data: clonedTask })
  } catch (error: unknown) {
    return data(
      {
        ok: false,
        error: toActionError(error),
      },
      { status: 500 },
    )
  }
}
