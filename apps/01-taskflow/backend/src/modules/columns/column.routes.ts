import { columnService } from '#bootstrap.js'
import { CreateColumnSchema, UpdateColumnSchema } from '#modules/columns/column.schemas.js'
import { NotFoundError } from '#shared/utils/errors.js'
import { type Request, type Response } from 'express'
import * as z from 'zod/mini'

export const getColumn = async (req: Request, res: Response) => {
  const columnId = z.uuid().parse(req.params.id)

  const result = await columnService.getById(columnId)

  if (!result) {
    throw new NotFoundError(`Column ${columnId} not found.`)
  }

  res.send(result)
}

export const createColumn = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)

  const newColumn = CreateColumnSchema.parse({ boardId, ...req.body })

  const result = await columnService.create(newColumn)

  if (!result) {
    throw new Error(`Failed to create Column for Board ${boardId}.`)
  }

  res.status(201).send(result)
}

export const deleteColumn = async (req: Request, res: Response) => {
  const columnId = z.uuid().parse(req.params.id)

  const existingColumn = await columnService.getById(columnId)

  if (!existingColumn) {
    throw new NotFoundError(`Column ${columnId} not found.`)
  }

  await columnService.delete(columnId)

  res.status(204).send()
}

export const updateColumn = async (req: Request, res: Response) => {
  const columnId = z.uuid().parse(req.params.id)
  const updatedColumnData = UpdateColumnSchema.parse(req.body)

  const result = await columnService.update(columnId, updatedColumnData)

  if (!result) {
    throw new NotFoundError(`Column ${columnId} not found.`)
  }

  res.send(result)
}
