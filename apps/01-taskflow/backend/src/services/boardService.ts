import type { Board } from "#models/board/board.js"
import type { CreateBoardDto } from "#models/board/types.js"
import type { BoardHistory } from "#patterns/memento/boardHistory.js"
import type { Snapshot } from "#patterns/memento/types.js"
import type { BoardRepository } from "#repositories/boardRepository.js"
import type { SnapshotRepository } from "#repositories/snapshotRepository.js"

import type { ColumnService } from "./columnService.js"
import type { TaskService } from "./taskService.js"

export class BoardService {
  private boardHistory: BoardHistory
  private boardRepository: BoardRepository
  private columnService: ColumnService
  private snapshotRepository: SnapshotRepository
  private taskService: TaskService

  constructor(
    boardHistory: BoardHistory,
    boardRepository: BoardRepository,
    columnService: ColumnService,
    snapshotRepository: SnapshotRepository,
    taskService: TaskService
  ) {
    this.boardHistory = boardHistory
    this.boardRepository = boardRepository
    this.columnService = columnService
    this.snapshotRepository = snapshotRepository
    this.taskService = taskService
  }

  create(board: CreateBoardDto): Promise<Board[]> {
    return this.boardRepository.create(board)
  }

  createSnapshot(
    boardId: string,
    state: string, 
    description?: string
  ): Promise<Snapshot | undefined> {
    return this.snapshotRepository.create(boardId, state, description)
  }

  delete(boardId: string): Promise<void> {
    return this.boardRepository.delete(boardId)
  }

  getAll(): Promise<Board[]> {
    return this.boardRepository.findAll()
  }

  getById(boardId: string): Promise<Board | undefined> {
    return this.boardRepository.findById(boardId)
  }

  getSnapshotById(snapshotId: string): Promise<Snapshot | undefined> {
    return this.snapshotRepository.findById(snapshotId)
  }

  getSnapshotsByBoardId(boardId: string): Promise<Snapshot[]> {
    return this.snapshotRepository.findByBoardId(boardId)
  }

  update(board: Board): Promise<Board[]> {
    return this.boardRepository.update(board)
  }
}