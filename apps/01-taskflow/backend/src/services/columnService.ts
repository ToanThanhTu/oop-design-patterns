import type { Column } from "#models/column/column.js"
import type { CreateColumnDto } from "#models/column/types.js"
import type { ColumnRepository } from "#repositories/columnRepository.js"

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

  getAll(): Promise<Column[]> {
    return this.columnRepository.findAll()
  }

  getByBoardId(boardId: string): Promise<Column[]> {
    return this.columnRepository.findByBoardId(boardId)
  }

  getById(columnId: string): Promise<Column | undefined> {
    return this.columnRepository.findById(columnId)
  }

  update(column: Column): Promise<Column[]> {
    return this.columnRepository.update(column)
  }
}