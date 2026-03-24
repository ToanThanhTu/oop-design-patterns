import type { CreateSubtaskDto } from "#models/subtask/types.js";
import type { Task } from "#models/task/task.js";
import type { CreateTaskDto } from "#models/task/types.js";
import type { TaskRepository } from "#repositories/taskRepository.js";

import type { TaskLabelService } from "./taskLabelService.js";

import { SubtaskService } from "./subtaskService.js";

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

      await this.subtaskService.create(newSubtask)
    }

    // add to task labels
    const taskLabelRecords = await this.taskLabelService.getByTaskId(taskId)
    const labelIds = taskLabelRecords.map((record) => record.labelId)

    for (const labelId of labelIds) {
      await this.taskLabelService.add(newTask.id, labelId)
    }

    return newTask
  }

  create(task: CreateTaskDto): Promise<Task | undefined> {
    return this.taskRepository.create(task)
  }

  delete(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId)
  }

  getByColumnId(columnId: string): Promise<Task[]> {
    return this.taskRepository.findByColumnId(columnId)
  }

  getById(taskId: string): Promise<Task | undefined> {
    return this.taskRepository.findById(taskId)
  }

  update(task: Task): Promise<Task[]> {
    return this.taskRepository.update(task)
  }
}