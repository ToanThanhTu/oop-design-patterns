import type { Task } from '#modules/tasks/task.model.js'
import type { TaskType } from '#modules/tasks/task.types.js'
import type { TaskRepository } from '#modules/tasks/task.repository.js'
import type { CreateSubtaskDto } from '#modules/subtasks/subtask.schemas.js'
import type { CreateTaskDto, UpdateTaskDto } from '#modules/tasks/task.schemas.js'

import type { TaskLabelService } from '#modules/labels/taskLabel.service.js'

import { SubtaskService } from '#modules/subtasks/subtask.service.js'

export class TaskService {
  private subtaskService: SubtaskService
  private taskLabelService: TaskLabelService
  private taskRepository: TaskRepository

  constructor(
    taskRepository: TaskRepository,
    subtaskService: SubtaskService,
    taskLabelService: TaskLabelService,
  ) {
    this.taskRepository = taskRepository
    this.subtaskService = subtaskService
    this.taskLabelService = taskLabelService
  }

  async clone(taskId: string): Promise<Task | undefined> {
    const task = await this.getById(taskId)

    if (!task) return undefined

    // Clone task
    const clone = task.clone()
    const newTask = await this.create(clone)

    if (!newTask) return undefined

    // Clone subtasks
    const subtasks = await this.subtaskService.getByTaskId(taskId)

    for (const subtask of subtasks) {
      const newSubtask: CreateSubtaskDto = {
        isComplete: subtask.isComplete,
        position: subtask.position,
        taskId: newTask.id,
        title: subtask.title,
      }

      const clonedSubtask = await this.subtaskService.create(newSubtask)

      if (!clonedSubtask) {
        throw new Error(`Failed to clone subtask ${subtask.id}`)
      }
    }

    // add to task labels
    const taskLabelRecords = await this.taskLabelService.getByTaskId(taskId)
    const labelIds = taskLabelRecords.map((record) => record.labelId)

    for (const labelId of labelIds) {
      const addedTaskLabel = await this.taskLabelService.add({ labelId, taskId: newTask.id })

      if (!addedTaskLabel) {
        throw new Error(`Failed to add cloned task ${newTask.id} label ${labelId} relation`)
      }
    }

    return newTask
  }

  async create(task: CreateTaskDto): Promise<Task | undefined> {
    if (task.position === undefined) {
      const length = await this.taskRepository
        .findByColumnId(task.columnId)
        .then((results) => results.length)
      task.position = length
    }

    return this.taskRepository.create(task)
  }

  delete(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId)
  }

  deleteByColumnId(columnId: string): Promise<void> {
    return this.taskRepository.deleteByColumnId(columnId)
  }

  getByColumnId(columnId: string): Promise<Task[]> {
    return this.taskRepository.findByColumnId(columnId)
  }

  getById(taskId: string): Promise<Task | undefined> {
    return this.taskRepository.findById(taskId)
  }

  recreateRaw(task: TaskType): Promise<Task | undefined> {
    return this.taskRepository.recreateRaw(task)
  }

  update(taskId: string, task: UpdateTaskDto): Promise<Task | undefined> {
    return this.taskRepository.update(taskId, task)
  }
}
