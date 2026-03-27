import { subtaskService } from "#bootstrap.js"
import { CreateSubtaskSchema, UpdateSubtaskSchema } from "#schemas/subtaskSchemas.js"
import { NotFoundError } from "#utils/errors.js"
import { type Request, type Response } from "express"
import * as z from 'zod/mini'

export const createSubtask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  const newSubtaskData = z
    .omit(CreateSubtaskSchema, { taskId: true })
    .parse(req.body)

  const newSubtask = CreateSubtaskSchema.parse({ taskId, ...newSubtaskData })
  
  const result = await subtaskService.create(newSubtask)

  if (!result) {
    throw new Error(`Failed to create Subtask for Task ${taskId}.`)
  }

  res.status(201).send(result)
}

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