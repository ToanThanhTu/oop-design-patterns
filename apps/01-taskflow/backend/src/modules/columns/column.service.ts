import type { Column } from '#modules/columns/column.model.js'
import type { ColumnType } from '#modules/columns/column.types.js'
import type { ColumnRepository } from '#modules/columns/column.repository.js'
import type { CreateColumnDto, UpdateColumnDto } from '#modules/columns/column.schemas.js'

import { BadRequestError } from '#shared/utils/errors.js'

export class ColumnService {
  private columnRepository: ColumnRepository

  constructor(columnRepository: ColumnRepository) {
    this.columnRepository = columnRepository
  }

  async create(column: CreateColumnDto): Promise<Column | undefined> {
    if (column.position === undefined) {
      const length = await this.columnRepository.findByBoardId(column.boardId).then((results) => results.length)
      column.position = length
    }

    return this.columnRepository.create(column)
  }

  delete(columnId: string): Promise<void> {
    return this.columnRepository.delete(columnId)
  }

  deleteByBoardId(boardId: string): Promise<void> {
    return this.columnRepository.deleteByBoardId(boardId)
  }

  getAll(): Promise<Column[]> {
    return this.columnRepository.findAll()
  }

  getByBoardId(boardId: string): Promise<Column[]> {
    return this.columnRepository.findByBoardId(boardId)
  }

  getById(columnId: string): Promise<Column | undefined> {
    return this.columnRepository.findById(columnId)
  }

  recreateRaw(column: ColumnType): Promise<Column | undefined> {
    return this.columnRepository.recreateRaw(column)
  }

  async reorder(boardId: string, orderedColumnIds: string[]): Promise<Column[]> {
    const columns = await this.columnRepository.findByBoardId(boardId)

    const newOrderColumnIdsSet = new Set(orderedColumnIds)

    for (const column of columns) {
      if (!newOrderColumnIdsSet.has(column.id)) {
        throw new BadRequestError("Columns IDs don't match board columns.")
      }
    }

    for (const column of columns) {
      column.position = orderedColumnIds.indexOf(column.id)
      await this.columnRepository.update(column.id, { position: column.position })
    }

    return columns
  }

  update(columnId: string, column: UpdateColumnDto): Promise<Column | undefined> {
    return this.columnRepository.update(columnId, column)
  }
}
