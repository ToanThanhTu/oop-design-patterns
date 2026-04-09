import { subtaskService } from '#bootstrap.js'
import { UpdateSubtaskSchema } from '#schemas/subtaskSchemas.js'
import { NotFoundError } from '#utils/errors.js'
import { type Request, type Response } from 'express'
import * as z from 'zod/mini'

export const deleteSubtask = async (req: Request, res: Response) => {
  const subtaskId = z.uuid().parse(req.params.id)

  const existingSubtask = await subtaskService.getById(subtaskId)

  if (!existingSubtask) {
    throw new NotFoundError(`Subtask ${subtaskId} not found.`)
  }

  await subtaskService.delete(subtaskId)

  res.status(204).send()
}

export const updateSubtask = async (req: Request, res: Response) => {
  const subtaskId = z.uuid().parse(req.params.id)
  const updatedSubtask = UpdateSubtaskSchema.parse(req.body)

  const result = await subtaskService.update(subtaskId, updatedSubtask)

  if (!result) {
    throw new NotFoundError(`Subtask ${subtaskId} not found.`)
  }

  res.send(result)
}
