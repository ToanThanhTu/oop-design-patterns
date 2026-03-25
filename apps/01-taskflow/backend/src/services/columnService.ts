import type { Column } from "#models/column/column.js"
import type { ColumnType } from "#models/column/types.js"
import type { ColumnRepository } from "#repositories/columnRepository.js"
import type { CreateColumnDto, UpdateColumnDto } from "#schemas/columnSchemas.js"

export class ColumnService {
  private columnRepository: ColumnRepository

  constructor(columnRepository: ColumnRepository) {
    this.columnRepository = columnRepository
  }

  create(column: CreateColumnDto): Promise<Column[]> {
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

  update(columnId: string, column: UpdateColumnDto): Promise<Column[]> {
    return this.columnRepository.update(columnId, column)
  }
}
