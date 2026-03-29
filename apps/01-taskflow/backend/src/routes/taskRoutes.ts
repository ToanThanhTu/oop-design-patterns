import { subtaskService, taskLabelService, taskService } from '#bootstrap.js'
import { AddTaskLabelSchema, RemoveTaskLabelSchema } from '#schemas/taskLabelSchemas.js'
import { CreateTaskSchema, UpdateTaskSchema } from '#schemas/taskSchemas.js'
import { NotFoundError } from '#utils/errors.js'
import { type Request, type Response } from 'express'
import * as z from 'zod/mini'

// Tasks

export const getTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)

  const result = await taskService.getById(taskId)

  if (!result) {
    throw new NotFoundError(`Task ${taskId} not found.`)
  }

  res.send(result)
}

export const createTask = async (req: Request, res: Response) => {
  const columnId = z.uuid().parse(req.params.id)
  const newTaskData = z.omit(CreateTaskSchema, { columnId: true }).parse(req.body)

  const newTask = CreateTaskSchema.parse({ columnId, ...newTaskData })

  const result = await taskService.create(newTask)

  if (!result) {
    throw new Error(`Failed to create Task for Column ${columnId}.`)
  }

  res.status(201).send(result)
}

export const updateTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)
  const updatedTask = UpdateTaskSchema.parse(req.body)

  const result = await taskService.update(taskId, updatedTask)

  if (!result) {
    throw new NotFoundError(`Task ${taskId} not found.`)
  }

  res.send(result)
}

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)

  const existingTask = await taskService.getById(taskId)

  if (!existingTask) {
    throw new NotFoundError(`Task ${taskId} not found.`)
  }

  await taskService.delete(taskId)

  res.status(204).send()
}

export const cloneTask = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)

  const result = await taskService.clone(taskId)

  if (!result) {
    throw new Error(`Failed to clone Task ${taskId}.`)
  }

  res.status(201).send(result)
}

// Subtasks

export const getTaskSubtasks = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.id)

  const result = await subtaskService.getByTaskId(taskId)

  res.send(result)
}

// Labels

export const attachLabel = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.taskId)
  const labelId = z.uuid().parse(req.body.labelId)

  const newTaskLabelRelation = AddTaskLabelSchema.parse({ labelId, taskId })

  const result = await taskLabelService.add(newTaskLabelRelation)

  if (!result) {
    throw new Error(`Failed to add new relation for Task ${taskId} and Label ${labelId}.`)
  }

  res.status(201).send(result)
}

export const detachLabel = async (req: Request, res: Response) => {
  const taskId = z.uuid().parse(req.params.taskId)
  const labelId = z.uuid().parse(req.params.labelId)

  const newTaskLabelRelation = RemoveTaskLabelSchema.parse({ labelId, taskId })

  await taskLabelService.remove(newTaskLabelRelation)

  res.status(204).send()
}
