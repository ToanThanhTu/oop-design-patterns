import { taskService } from "#bootstrap.js"
import { UpdateTaskSchema } from "#schemas/taskSchemas.js"
import { NotFoundError } from "#utils/errors.js"
import { type Request, type Response } from "express"
import * as z from 'zod/mini'

export const getTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  
  const result = await taskService.getById(taskId)

  if (!result) {
    throw new NotFoundError(`Task ${taskId} not found.`)
  }

  res.send(result)
}

export const updateTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  const updatedTask = UpdateTaskSchema.parse(req.body)
  
  const result = await taskService.update(taskId, updatedTask)

  if (!result) {
    throw new NotFoundError(`Task ${taskId} not found`)
  }

  res.send(result)
}

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  
  await taskService.delete(taskId)

  res.status(204).send()
}

export const cloneTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  
  const result = await taskService.clone(taskId)

  if (!result) {
    throw new NotFoundError(`Task ${taskId} not found`)
  }

  res.status(201).send(result)
}
