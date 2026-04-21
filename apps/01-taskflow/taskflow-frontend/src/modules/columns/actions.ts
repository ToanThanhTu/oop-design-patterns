import { createColumn } from '@/modules/columns/api'
import { CreateColumnSchema } from '@/modules/columns/schemas'
import { toActionError } from '@/shared/lib/errors/toActionError'
import { zodErrorToActionError } from '@/shared/lib/errors/zodErrorToActionError'
import { data } from 'react-router'

export async function handleCreateColumn(formData: FormData, boardId: string) {
  const parseResult = CreateColumnSchema.safeParse(Object.fromEntries(formData))

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
    const createdColumn = await createColumn(boardId, parseResult.data)
    return data({ ok: true, data: createdColumn })
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
