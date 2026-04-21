import type { Board } from '#modules/boards/board.model.js'
import type { BoardType } from '#modules/boards/board.types.js'
import type { Column } from '#modules/columns/column.model.js'
import type { ColumnType } from '#modules/columns/column.types.js'
import type { SubtaskType } from '#modules/subtasks/subtask.types.js'
import type { Task } from '#modules/tasks/task.model.js'
import type { TaskType } from '#modules/tasks/task.types.js'
import type { TaskLabelType } from '#modules/labels/taskLabel.types.js'
import type { BoardStateType, Snapshot } from '#modules/boards/patterns/types.js'
import type { BoardRepository } from '#modules/boards/board.repository.js'
import type { SnapshotRepository } from '#modules/boards/snapshot.repository.js'
import type { CreateBoardDto, UpdateBoardDto } from '#modules/boards/board.schemas.js'
import type { SubtaskService } from '#modules/subtasks/subtask.service.js'
import type { TaskLabelService } from '#modules/labels/taskLabel.service.js'

import { TaskIterator } from '#modules/tasks/patterns/iterator.js'
import { BoardHistory } from '#modules/boards/patterns/history.js'
import { BoardSnapshot } from '#modules/boards/patterns/snapshot.js'

import type { ColumnService } from '#modules/columns/column.service.js'
import type { TaskService } from '#modules/tasks/task.service.js'

export class BoardService {
  private boardHistoryMap = new Map<string, BoardHistory>()
  private boardRepository: BoardRepository
  private columnService: ColumnService
  private snapshotRepository: SnapshotRepository
  private subtaskService: SubtaskService
  private taskLabelService: TaskLabelService
  private taskService: TaskService

  constructor(
    boardRepository: BoardRepository,
    columnService: ColumnService,
    snapshotRepository: SnapshotRepository,
    subtaskService: SubtaskService,
    taskLabelService: TaskLabelService,
    taskService: TaskService,
  ) {
    this.boardRepository = boardRepository
    this.columnService = columnService
    this.snapshotRepository = snapshotRepository
    this.subtaskService = subtaskService
    this.taskLabelService = taskLabelService
    this.taskService = taskService
  }

  create(board: CreateBoardDto): Promise<Board | undefined> {
    return this.boardRepository.create(board)
  }

  async createSnapshot(boardId: string, description: null | string): Promise<Snapshot | undefined> {
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

    this.getBoardHistory(boardId).save(newBoardSnapshot)

    return this.snapshotRepository.create({
      boardId,
      description,
      state: newBoardSnapshot.getBoardState(),
    })
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

  async getTaskIterator(boardId: string): Promise<TaskIterator> {
    const columns: Column[] = await this.columnService.getByBoardId(boardId)
    const tasks: Task[] = []

    const taskLabelMap = new Map<string, string[]>()

    for (const column of columns) {
      const tasksOfColumn = await this.taskService.getByColumnId(column.id)
      tasks.push(...tasksOfColumn)
    }

    for (const task of tasks) {
      const taskLabelsOfTask = await this.taskLabelService.getByTaskId(task.id)

      taskLabelMap.set(
        task.id,
        taskLabelsOfTask.map((taskLabel) => taskLabel.labelId),
      )
    }

    return new TaskIterator(tasks, taskLabelMap)
  }

  async redo(boardId: string): Promise<BoardStateType | undefined> {
    const boardSnapshot = this.getBoardHistory(boardId).redo()

    if (!boardSnapshot) return undefined

    const boardState: BoardStateType = JSON.parse(boardSnapshot.getBoardState())

    if (boardId !== boardState.board.id) return undefined

    await this.restoreState(boardState)

    return boardState
  }

  async restoreState(boardState: BoardStateType): Promise<void> {
    // Delete current state (cascade)
    await this.columnService.deleteByBoardId(boardState.board.id)

    // Re-insert state to be restored
    // Re-insert columns
    for (const column of boardState.columns) {
      await this.columnService.recreateRaw(column)
    }

    for (const task of boardState.tasks) {
      await this.taskService.recreateRaw(task)
    }

    for (const subtask of boardState.subtasks) {
      await this.subtaskService.recreateRaw(subtask)
    }

    for (const taskLabel of boardState.taskLabels) {
      await this.taskLabelService.add(taskLabel)
    }
  }

  async undo(boardId: string): Promise<BoardStateType | undefined> {
    const boardSnapshot = this.getBoardHistory(boardId).undo()

    if (!boardSnapshot) return undefined

    const boardState: BoardStateType = JSON.parse(boardSnapshot.getBoardState())

    if (boardId !== boardState.board.id) return undefined

    await this.restoreState(boardState)

    return boardState
  }

  update(boardId: string, board: UpdateBoardDto): Promise<Board | undefined> {
    return this.boardRepository.update(boardId, board)
  }

  private getBoardHistory(boardId: string): BoardHistory {
    const existingBoardHistory = this.boardHistoryMap.get(boardId)

    if (existingBoardHistory) {
      return existingBoardHistory
    }

    const newBoardHistory = new BoardHistory()
    this.boardHistoryMap.set(boardId, newBoardHistory)

    return newBoardHistory
  }
}
