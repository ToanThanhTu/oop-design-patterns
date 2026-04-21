# TaskFlow -- Task Management Board

A Kanban-style task board where users create, organize, and track tasks across columns. Tasks can be cloned from templates, and the board state can be saved and restored via snapshots.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 + React Router v7 (framework mode, SSR) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix) + Oxanium font |
| Backend | Express 5 |
| Database | SQLite (better-sqlite3 + Drizzle ORM) |
| Validation | Zod v4 |

## Concepts Covered

### OOP Fundamentals
- **Class** -- `Task`, `Column`, `Board`, `Label`, `Subtask`, `TaskLabel`
- **Objects** -- Task instances created from class blueprints
- **Encapsulation** -- Private backing fields (`_field`) with TS native `get`/`set` accessors; `toJSON()` + `toType()` methods for clean serialization
- **Abstraction** -- `TaskTemplate` abstract class hiding creation complexity

### SOLID Principles
- **SRP** -- Separate concerns: models, repositories, services, patterns, routes
- **OCP** -- `Bug`, `Feature`, `Story` extend `Task` without modifying it

### Design Patterns

#### Prototype
`task.clone()` deep-copies a task, its subtasks, and its labels. Returns a `CreateTaskDto` (no ID/timestamps -- DB generates those). Template tasks (`isTemplate: true`) act as prototypes.

#### Memento
`BoardSnapshot` captures full board state (board + columns + tasks + subtasks + task-labels) as JSON. `BoardHistory` caretaker manages per-board undo/redo stacks via `Map<boardId, BoardHistory>`. `BoardService` coordinates save, restore (cascade delete + `recreateRaw` re-insertion), and `SnapshotRepository` persistence.

#### Iterator
`TaskIterator` implements `Iterable<Task>` via `Symbol.iterator` with a generator function. Supports filter predicates: priority, assignee, type, due-date range, label (via `Map<taskId, labelId[]>`).

## Project Structure

```
01-taskflow/
├── backend/
│   ├── src/
│   │   ├── db/              # Drizzle schema + better-sqlite3 connection
│   │   ├── models/          # Domain classes (get/set accessors, toType/toJSON)
│   │   ├── patterns/        # prototype/, memento/, iterator/ subdirs
│   │   ├── repositories/    # Data access (toModel/toRow, recreateRaw for snapshots)
│   │   ├── services/        # Business logic + pattern coordination
│   │   ├── schemas/         # Zod schemas (source of truth for DTOs)
│   │   ├── routes/          # Express route handlers
│   │   ├── middleware/      # errorHandler.ts
│   │   ├── utils/           # errors.ts (HttpError hierarchy)
│   │   ├── bootstrap.ts     # DI wiring (singletons for repos + services)
│   │   ├── seed.ts          # Sample data (Development + Chores boards)
│   │   └── index.ts         # Express app entry
│   └── drizzle/             # Migration files
├── taskflow-frontend/          # Domain-driven layout
│   ├── src/
│   │   ├── modules/         # Domain modules (boards/, columns/, tasks/, subtasks/, labels/)
│   │   │   └── <domain>/    # components/, entities/, actions.ts, api.ts, schemas.ts
│   │   ├── shared/          # Cross-cutting (no domain)
│   │   │   ├── api/         # client.ts, endpoints.ts
│   │   │   ├── components/  # forms/, modal/, ui/ (shadcn)
│   │   │   ├── filter/      # FilterBar + schemas
│   │   │   └── lib/         # errors/, formHelpers.ts, utils.ts
│   │   ├── pages/           # HomePage.tsx, BoardPage.tsx (loaders + actions that dispatch)
│   │   ├── routes/          # Resource routes (loader-only: /api/tasks/:id/subtasks|labels)
│   │   ├── entry.client.tsx # Hydration
│   │   ├── entry.server.tsx # Streaming SSR
│   │   ├── root.tsx         # Layout + shared ErrorBoundary
│   │   ├── routes.ts        # Route config
│   │   └── index.css        # Tailwind + theme tokens
│   └── react-router.config.ts
└── IMPLEMENTATION_GUIDE.md  # Step-by-step build guide
```

See [`taskflow-frontend/README.md`](taskflow-frontend/README.md) for per-module details and import rules.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/boards` | List all boards |
| `POST` | `/boards` | Create a board |
| `GET` | `/boards/:id` | Get a board |
| `PUT` | `/boards/:id` | Update a board |
| `DELETE` | `/boards/:id` | Delete a board (cascades) |
| `GET` | `/boards/:id/snapshots` | List snapshots |
| `POST` | `/boards/:id/snapshots` | Create a snapshot |
| `POST` | `/boards/:id/undo` | Undo to previous snapshot |
| `POST` | `/boards/:id/redo` | Redo |
| `GET` | `/boards/:id/tasks` | Filtered task list (Iterator) |
| `GET` | `/boards/:id/columns` | List columns |
| `POST` | `/boards/:id/columns` | Create column (auto-position) |
| `PATCH` | `/boards/:id/columns/reorder` | Reorder columns |
| `GET`/`PUT`/`DELETE` | `/columns/:id` | Column CRUD |
| `POST` | `/columns/:id/tasks` | Create task in column |
| `GET`/`PUT`/`DELETE` | `/tasks/:id` | Task CRUD |
| `POST` | `/tasks/:id/clone` | Clone task (Prototype) |
| `GET` | `/tasks/:id/subtasks` | List task's subtasks |
| `POST` | `/tasks/:id/subtasks` | Create subtask |
| `POST` | `/tasks/:id/labels` | Attach label |
| `DELETE` | `/tasks/:taskId/labels/:labelId` | Detach label |
| `PUT`/`DELETE` | `/subtasks/:id` | Subtask CRUD |
| `GET`/`POST` | `/labels` | Label list + create |

## Getting Started

```bash
# Backend
cd backend
pnpm install
pnpm db:push      # Create SQLite tables
pnpm db:seed      # Populate sample data
pnpm dev          # Starts on http://localhost:3001

# Frontend (separate terminal)
cd taskflow-frontend
pnpm install
pnpm dev          # Starts on http://localhost:5173
```

Backend `.env` needs `DB_FILE_NAME=local.db` (no `file:` prefix -- `better-sqlite3` expects a plain path).

See [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md) for a step-by-step walkthrough.
