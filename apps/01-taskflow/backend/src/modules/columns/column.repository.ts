import type { Column } from '#modules/columns/column.model.js'
import type { CreateColumnDto, UpdateColumnDto } from '#modules/columns/column.schemas.js'
import type { ColumnType } from '#modules/columns/column.types.js'

export interface ColumnRepository {
  create(column: CreateColumnDto): Promise<Column | undefined>
  delete(id: string): Promise<void>
  deleteByBoardId(boardId: string): Promise<void>
  findAll(): Promise<Column[]>
  findByBoardId(boardId: string): Promise<Column[]>
  findById(id: string): Promise<Column | undefined>
  recreateRaw(column: ColumnType): Promise<Column | undefined>
  update(columnId: string, column: UpdateColumnDto): Promise<Column | undefined>
}
