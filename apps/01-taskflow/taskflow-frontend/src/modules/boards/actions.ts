import { createBoard } from '@/modules/boards/api'
import { CreateBoardSchema } from '@/modules/boards/schemas'
import { toActionError } from '@/shared/lib/errors/toActionError'
import { zodErrorToActionError } from '@/shared/lib/errors/zodErrorToActionError'
import { data } from 'react-router'

export async function handleCreateBoard(formData: FormData) {
  const parseResult = CreateBoardSchema.safeParse(Object.fromEntries(formData))

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
    const createdBoard = await createBoard(parseResult.data)
    return data({ ok: true, data: createdBoard })
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
