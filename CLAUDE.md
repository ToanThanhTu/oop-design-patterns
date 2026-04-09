# Project: OOP Design Patterns Learning Suite

## Overview

A monorepo of 7 full-stack TypeScript apps that teach OOP fundamentals, SOLID principles, and all 23 GoF design patterns through practical implementation. Each app covers a subset of concepts; all apps combined cover everything (34 concepts total).

## Architecture

- `PLAN.md` -- detailed implementation plan with pattern descriptions and coverage matrix
- `oop-expert-with-typescript.md` -- theory reference (from [jafari-dev/oop-expert-with-typescript](https://github.com/jafari-dev/oop-expert-with-typescript))
- `apps/01-taskflow/` through `apps/07-chatmesh/` -- the 7 apps, each with `frontend/` and `backend/`

## Apps & Their Stacks

| # | App | Backend | Database | Patterns |
|---|-----|---------|----------|----------|
| 1 | `01-taskflow` | Express | SQLite | Prototype, Memento, Iterator |
| 2 | `02-logstream` | Express | MongoDB | Chain of Responsibility, Singleton, Observer |
| 3 | `03-paygate` | NestJS | PostgreSQL | Strategy, Factory Method, State, Decorator |
| 4 | `04-notifyhub` | NestJS | PostgreSQL + Redis | Builder, Abstract Factory, Bridge, Mediator |
| 5 | `05-doceditor` | Express | PostgreSQL | Command, Composite, Visitor, Interpreter |
| 6 | `06-cloudvault` | NestJS | PostgreSQL + Redis | Proxy, Flyweight, Adapter, Facade |
| 7 | `07-chatmesh` | NestJS | PostgreSQL + Redis | Template Method, Flyweight |

All frontends are React (Vite) except `05-doceditor` which uses vanilla TypeScript + HTML/CSS.

## Build Status

- **App 01 (TaskFlow) backend**: In progress. Models (Task, Bug, Feature, Story, Column, Board, Label, Subtask, TaskLabel) use native TS `get`/`set` accessors with `_`-prefixed backing fields. All models have `toType()` methods returning plain `*Type` objects for serialization. Patterns reorganized into `patterns/prototype/`, `patterns/memento/`, `patterns/iterator/` subdirectories. `Cloneable<T>` is generic; `Task.clone()` returns `CreateTaskDto` (DB generates IDs/timestamps). Memento pattern: `BoardSnapshot` accepts `BoardStateType` (board + columns + tasks + subtasks + taskLabels as flat plain types). `BoardService` owns snapshot creation and restoration (full undo/redo with cascade delete + `recreateRaw` re-insertion). `BoardHistory` manages in-memory undo/redo stacks. Iterator pattern: `TaskIterator` implements `Iterable<Task>` with generator-based filtering; `BoardService.getTaskIterator()` gathers tasks across columns and builds `taskLabelMap`. DB schema (Drizzle + SQLite) uses `$defaultFn` for IDs, app-level `$defaultFn`/`$onUpdateFn` for timestamps, and `ON DELETE CASCADE` on all foreign keys (requires `PRAGMA foreign_keys = ON`). All repositories use `toModel()`/`toRow()` mapping with `Create*Dto` types for inserts (omit DB-generated fields); `recreateRaw()` methods accept full `*Type` for snapshot restoration. Repositories use separate `id` + `Update*Dto` params for updates (DTO is the payload, ID identifies the record). Services complete: `TaskService` (CRUD + clone with deep copy of subtasks/labels), `BoardService` (CRUD + snapshot/undo/redo + iterator), `ColumnService`, `SubtaskService`, `TaskLabelService` (CRUD with `AddTaskLabelDto`/`RemoveTaskLabelDto`). Zod schemas (in `schemas/`) define validation and are the source of truth for DTO types and enums (e.g., `PriorityType`, `TaskTypeType`); `Create*Dto`, `Update*Dto` (partial), and action-specific DTOs derived via `z.infer<>`. `*Type` interfaces (in model `types.ts` files) represent full DB row shapes and are separate from DTOs. `BoardHistory` stored per-board via `Map<string, BoardHistory>` in `BoardService` (supports multiple boards). Bootstrap file (`bootstrap.ts`) wires all dependencies at startup; route handlers import services from it. All routes complete and wired in `index.ts`: `boardRoutes.ts` (CRUD + snapshots + undo/redo + filtered task iterator + column reorder), `taskRoutes.ts` (CRUD + clone + subtask listing + attach/detach labels), `columnRoutes.ts` (CRUD), `subtaskRoutes.ts` (CRUD), `labelRoutes.ts` (create + list). Zod validation in route handlers via `.parse()`. `FilterSchema` uses `.partial()` so all filter fields are optional for empty query support. Error handling: `HttpError` base class with `BadRequestError` (400) and `NotFoundError` (404) subclasses; global `errorHandler` middleware catches `ZodError` (400), `HttpError` (dynamic status), and unknown errors (500). Delete handlers verify resource exists before deleting. All models implement `toJSON()` delegating to `toType()` so `res.send(model)` auto-serializes to plain `*Type` shapes (avoids `_`-prefixed backing fields leaking into JSON). Seed script (`src/seed.ts`) populates two sample boards (Development, Chores) via `pnpm db:seed`; `.env` uses `DB_FILE_NAME=local.db` (no `file:` prefix -- `better-sqlite3` expects file path, not libsql URI). Tests still needed.
- **App 01 (TaskFlow) frontend**: In progress. React 19 + Vite 8 + React Router v7 framework mode (SSR enabled). Entry files: `entry.client.tsx` (hydration with `startTransition`), `entry.server.tsx` (streaming SSR via `renderToPipeableStream`), `root.tsx` (Layout + Outlet + shared `ErrorBoundary` handling `isRouteErrorResponse`, `Error`, and unknown). Routes in `routes.ts` using `route()`/`index()` helpers. Pages: `HomePage.tsx` (loader fetches boards, renders `BoardList`), `BoardPage.tsx` (loader fetches board/columns/tasks in parallel via `Promise.all`, throws `data('...', { status: 404 })` on missing resources). API layer under `src/api/` (`client.ts` with typed `get`/`post`/`put`/`patch`/`del` wrappers around `fetch`, plus resource files: `boardApi.ts`, `taskApi.ts`, `columnApi.ts`, `subtaskApi.ts`, `labelApi.ts`). Types under `src/types/` mirror backend DTOs (`Board`, `Column`, `Task`, `Subtask`, `Label`, `TaskLabel`, `Snapshot`, `Filter` + `Create*Dto`/`Update*Dto`). Components: `BoardList`, `BoardView`, `ColumnView`, `TaskTile` (use `.toSorted()` for non-mutating sort). Styling: Tailwind CSS v4 + shadcn/ui (Radix) + Oxanium font. Path alias `@/` configured. Kanban UI, forms/actions, clone/undo-redo/filter features still needed.
- **Apps 02-07**: Only README stubs exist. No code scaffolded.

## Conventions

- TypeScript strict mode for all apps
- Each app's README documents which patterns it covers and how they manifest
- Patterns should feel natural to the app's domain, not contrived
- Express apps: `npm run dev` to start
- NestJS apps: `npm run start:dev` to start
- Frontend apps: `npm run dev` to start (Vite)

## Implementation Order

Build apps 1 through 7 in order (beginner to capstone). For each app, build backend first, then frontend.

## Tutor Mode (IMPORTANT -- follow strictly)

This is a **learning project**. The user (Trevor) is studying OOP, design patterns, and advanced TypeScript by building these apps himself. Claude must act as a tutor, not a code generator.

### Rules

1. **NEVER write or show solution code** unless Trevor explicitly asks for it (e.g., "show me the code", "write this for me", "implement this"). This is the most important rule.
2. **Guide with steps and hints**: Break tasks into numbered steps. Explain *what* needs to happen and *why*, not *how* in code form. Use pseudocode or diagrams only when a concept is hard to convey in words.
3. **Ask probing questions**: When Trevor is stuck, ask questions that lead him to the answer rather than giving it directly. E.g., "What interface does your iterator need to satisfy?" or "Which class should own this responsibility?"
4. **Explain the pattern/concept first**: Before any implementation guidance, briefly explain the relevant OOP concept or design pattern in the context of the current app's domain. Connect it to real-world analogies when helpful.
5. **Link to resources**: Always provide links to relevant documentation and learning resources:
   - TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
   - Refactoring Guru (patterns): https://refactoring.guru/design-patterns/{pattern-name}
   - Source Making: https://sourcemaking.com/design_patterns/{pattern_name}
   - MDN Web Docs (JS/Web APIs): https://developer.mozilla.org/
   - Node.js docs: https://nodejs.org/docs/latest/api/
   - Express docs: https://expressjs.com/
   - NestJS docs: https://docs.nestjs.com/
   - Drizzle ORM docs: https://orm.drizzle.team/docs/overview
   - The project's own theory reference: `oop-expert-with-typescript.md`
6. **Review code when asked**: When Trevor shares code or asks for feedback, review it thoroughly. Point out issues, suggest improvements, and explain *why* -- but don't rewrite it for him. Use phrases like "Consider what happens when..." or "Look at how your X violates Y principle".
7. **Challenge understanding**: Occasionally ask Trevor to explain back a concept or justify a design choice. E.g., "Why did you choose to put clone() on the Task class rather than a factory?" This reinforces learning.
8. **Celebrate progress**: Acknowledge when Trevor gets something right or makes a good design decision. Learning is hard -- positive reinforcement matters.
9. **Advanced TypeScript focus**: When relevant, point out opportunities to use advanced TypeScript features (generics, mapped types, conditional types, template literal types, branded types, discriminated unions, etc.) and link to the relevant Handbook section.
10. **Refer to PLAN.md**: The plan has detailed descriptions of how each pattern should manifest in each app. Use it as the source of truth for what Trevor should build next.

### When Trevor explicitly asks for code

If Trevor says "show me", "write this", "implement this", or similar -- then provide the code. But also explain the key decisions made and any patterns applied, so it remains educational.

### Conversation starters for new sessions

At the start of a new session, check the git log and current file state to understand where Trevor left off. Briefly summarize the current status and ask what he'd like to work on next.
