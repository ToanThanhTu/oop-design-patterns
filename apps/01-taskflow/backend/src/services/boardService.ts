import type { Board } from "#models/board/board.js"
import type { BoardType, CreateBoardDto } from "#models/board/types.js"
import type { ColumnType } from "#models/column/types.js"
import type { SubtaskType } from "#models/subtask/types.js"
import type { TaskType } from "#models/task/types.js"
import type { TaskLabelType } from "#models/taskLabel/types.js"
import type { BoardHistory } from "#patterns/memento/boardHistory.js"
import type { BoardStateType, Snapshot } from "#patterns/memento/types.js"
import type { BoardRepository } from "#repositories/boardRepository.js"
import type { SnapshotRepository } from "#repositories/snapshotRepository.js"
import type { SubtaskService } from "#services/subtaskService.js"
import type { TaskLabelService } from "#services/taskLabelService.js"

import { BoardSnapshot } from "#patterns/memento/boardSnapshot.js"

import type { ColumnService } from "./columnService.js"
import type { TaskService } from "./taskService.js"

export class BoardService {
  private boardHistory: BoardHistory
  private boardRepository: BoardRepository
  private columnService: ColumnService
  private snapshotRepository: SnapshotRepository
  private subtaskService: SubtaskService
  private taskLabelService: TaskLabelService
  private taskService: TaskService

  constructor(
    boardHistory: BoardHistory,
    boardRepository: BoardRepository,
    columnService: ColumnService,
    snapshotRepository: SnapshotRepository,
    subtaskService: SubtaskService,
    taskLabelService: TaskLabelService,
    taskService: TaskService,
  ) {
    this.boardHistory = boardHistory
    this.boardRepository = boardRepository
    this.columnService = columnService
    this.snapshotRepository = snapshotRepository
    this.subtaskService = subtaskService
    this.taskLabelService = taskLabelService
    this.taskService = taskService
  }

  create(board: CreateBoardDto): Promise<Board[]> {
    return this.boardRepository.create(board)
  }

  async createSnapshot(boardId: string, description?: string): Promise<Snapshot | undefined> {
    // Get Board snapshot
    const board = await this.getById(boardId)

    if (!board) return undefined

    const boardSnapshot: BoardType = board.toType()

    const columnSnapshots: ColumnType[] = []
    const subtaskSnapshots: SubtaskType[] = []
    const taskSnapshots: TaskType[] = []
    const taskLabelSnapshots: TaskLabelType[] = []

    const columns = await this.columnService.getByBoardId(boardId)
    for (const column of columns) {
      // Get Column snapshots
      columnSnapshots.push(column.toType())

      const tasksInColumn = await this.taskService.getByColumnId(column.id)
      for (const task of tasksInColumn) {
        // Get Task snapshots
        taskSnapshots.push(task.toType())

        // Get Subtask snapshots
        const subtasksOfTask = await this.subtaskService.getByTaskId(task.id)
        for (const subtask of subtasksOfTask) {
          subtaskSnapshots.push(subtask.toType())
        }

        // Get TaskLabel snapshots
        const taskLabels = await this.taskLabelService.getByTaskId(task.id)
        for (const taskLabel of taskLabels) {
          taskLabelSnapshots.push(taskLabel.toType())
        }
      }
    }

    const newBoardState: BoardStateType = {
      board: boardSnapshot,
      columns: columnSnapshots,
      subtasks: subtaskSnapshots,
      taskLabels: taskLabelSnapshots,
      tasks: taskSnapshots,
    }

    const newBoardSnapshot = new BoardSnapshot(newBoardState)

    this.boardHistory.save(newBoardSnapshot)

    return this.snapshotRepository.create(boardId, newBoardSnapshot.getBoardState(), description)
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

  redo(): void {
    const boardSnapshot = this.boardHistory.redo()

    if (!boardSnapshot) return undefined

    const boardState: BoardStateType = JSON.parse(boardSnapshot.getBoardState())
  }

  undo(): void {
    const boardSnapshot = this.boardHistory.undo()

    if (!boardSnapshot) return undefined

    const boardState: BoardStateType = JSON.parse(boardSnapshot.getBoardState())
  }

  update(board: Board): Promise<Board[]> {
    return this.boardRepository.update(board)
  }
}
