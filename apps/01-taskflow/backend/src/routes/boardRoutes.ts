
import { boardService, columnService } from "#bootstrap.js"
import { type CreateBoardDto, CreateBoardSchema, type UpdateBoardDto, UpdateBoardSchema } from "#schemas/boardSchemas.js"
import { FilterSchema } from "#schemas/filterSchemas.js"
import { BadRequestError, NotFoundError } from "#utils/errors.js"
import { type Request, type Response } from "express"
import * as z from 'zod/mini'

// Boards
export const getBoards = async (_req: Request, res: Response) => {
  const result = await boardService.getAll()

  res.send(result)
}

export const getBoard = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)
  const result = await boardService.getById(boardId)

  if (!result) {
    throw new NotFoundError(`Board ${boardId} not found`)
  }

  res.send(result)
}

export const createBoard = async (req: Request, res: Response) => {
  const board: CreateBoardDto = CreateBoardSchema.parse(req.body)
  const result = await boardService.create(board)

  res.status(201).send(result)
}

export const deleteBoard = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)
  await boardService.delete(boardId)

  res.status(204).send()
}

export const updateBoard = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)
  const board: UpdateBoardDto = UpdateBoardSchema.parse(req.body)

  const result = await boardService.update(boardId, board)

  if (!result) {
    throw new NotFoundError(`Board ${boardId} not found`)
  }

  res.send(result)
}

// Board Snapshots
export const getBoardSnapshot = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)

  const result = await boardService.getSnapshotsByBoardId(boardId)

  res.send(result)
}

export const createBoardSnapshot = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)
  const description = z.nullable(z.string()).parse(req.body.description)

  const result = await boardService.createSnapshot(boardId, description)

  if (!result) {
    throw new NotFoundError(`Failed to create Board Snapshot, Board ${boardId} not found.`)
  }

  res.status(201).send(result)
}

export const undoBoardSnapshot = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)

  const result = await boardService.undo(boardId)

  if (!result) {
    throw new BadRequestError('Failed to undo Board Snapshot')
  }

  res.send(result)
}

export const redoBoardSnapshot = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)

  const result = await boardService.redo(boardId)

  if (!result) {
    throw new BadRequestError('Failed to redo Board Snapshot')
  }

  res.send(result)
}

export const getBoardTasks = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)
  const filters = FilterSchema.parse(req.query)

  const taskIterator = await boardService.getTaskIterator(boardId)
  taskIterator.filterBy(filters)

  const result = [...taskIterator]

  res.send(result)
}

export const getBoardColumns = async (req: Request, res: Response) => {
  const boardId = z.uuid().parse(req.params.id)

  const result = await columnService.getByBoardId(boardId)

  res.send(result)
}
