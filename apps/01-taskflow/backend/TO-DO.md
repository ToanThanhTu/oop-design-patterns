# TO-DO: Zod Schemas & Type Refactoring

## Schemas to create

- [x] `columnSchemas.ts` -- `CreateColumnSchema` (boardId, name, position), `UpdateColumnSchema` (partial)
- [x] `subtaskSchemas.ts` -- `CreateSubtaskSchema` (taskId, title, position, isComplete), `UpdateSubtaskSchema` (partial)
- [x] `labelSchemas.ts` -- `CreateLabelSchema` (name, color), `UpdateLabelSchema` (partial)
- [x] `taskLabelSchemas.ts` -- `AddTaskLabelSchema` (taskId, labelId) -- or validate via route params only
- [x] `snapshotSchemas.ts` -- `CreateSnapshotSchema` (description?) -- boardId comes from route param

## Type refactoring (schemas as source of truth)

### Done

- [x] `taskSchemas.ts` -- `CreateTaskDto`, `PriorityType`, `TaskTypeType` derived from Zod
- [x] `boardSchemas.ts` -- schema defined (but `CreateBoardDto` still in `models/board/types.ts` as `Omit<>`)

### To do

- [x] `models/board/types.ts` -- remove `CreateBoardDto`, derive from `boardSchemas.ts` instead
- [x] `models/column/types.ts` -- remove `CreateColumnDto`, derive from `columnSchemas.ts`
- [x] `models/subtask/types.ts` -- remove `CreateSubtaskDto`, derive from `subtaskSchemas.ts`
- [x] `models/label/types.ts` -- remove `CreateLabelDto`, derive from `labelSchemas.ts`
- [ ] Update all imports of `Create*Dto` across repositories and services to point to schema files

## Naming convention

- Schemas: `camelCase` (e.g., `createBoardSchema`) -- align with boardSchemas.ts pattern
- Types: `PascalCase` (e.g., `CreateBoardDto`)
