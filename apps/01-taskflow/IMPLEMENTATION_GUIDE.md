# TaskFlow -- Implementation Guide

A step-by-step guide to building the TaskFlow backend and frontend. This is a **learning guide** -- it gives you structure, hints, and resources, but you write the code.

## What You'll Learn

| Category | Concepts |
|----------|----------|
| OOP Fundamentals | Class, Objects, Encapsulation, Abstraction |
| SOLID | SRP (Single Responsibility), OCP (Open/Closed) |
| Design Patterns | Prototype, Memento, Iterator |

## Where Do OOP Concepts Live?

**Mostly backend.** The backend is where your domain models, business logic, and pattern implementations live. The frontend is a thin UI layer that calls the API.

| Concept | Backend | Frontend |
|---------|---------|----------|
| Classes & Objects | `Task`, `Board`, `Column` models | Minimal (React components aren't OOP) |
| Encapsulation | Private fields + getters/setters on models | N/A |
| Abstraction | `abstract TaskTemplate` base class | N/A |
| SRP | Separate Repository, Service, Serializer layers | N/A |
| OCP | `Bug`, `Feature`, `Story` extend `Task` | N/A |
| Prototype | `task.clone()` deep copies | Clone button calls API |
| Memento | `BoardHistory` + snapshots | Undo/redo buttons call API |
| Iterator | `TaskIterator` with filter predicates | Filter UI calls API |

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Express | 5.x | HTTP framework |
| TypeScript | 5.9+ | Type safety |
| Drizzle ORM | 0.45+ | Type-safe SQL, migrations |
| better-sqlite3 | 12.x | SQLite driver (synchronous, fast) |
| Zod | 4.x | Request validation |
| tsx | 4.x | Run TypeScript directly in dev |
| crypto.randomUUID() | built-in | UUID generation (no extra package needed) |

---

## Database Schema

7 tables. SQLite creates the `.db` file automatically on first connection.

```
boards
  id          TEXT PK
  name        TEXT NOT NULL
  created_at  TEXT NOT NULL
  updated_at  TEXT NOT NULL

columns
  id          TEXT PK
  board_id    TEXT FK → boards.id
  name        TEXT NOT NULL
  position    INTEGER NOT NULL
  created_at  TEXT NOT NULL

tasks
  id          TEXT PK
  column_id   TEXT FK → columns.id
  type        TEXT NOT NULL DEFAULT 'task'    -- 'task' | 'bug' | 'feature' | 'story'
  title       TEXT NOT NULL
  description TEXT
  priority    TEXT NOT NULL DEFAULT 'medium'  -- 'low' | 'medium' | 'high'
  assignee    TEXT
  due_date    TEXT
  is_template INTEGER NOT NULL DEFAULT 0      -- boolean (Prototype pattern)
  position    INTEGER NOT NULL
  created_at  TEXT NOT NULL
  updated_at  TEXT NOT NULL

subtasks
  id          TEXT PK
  task_id     TEXT FK → tasks.id
  title       TEXT NOT NULL
  is_complete INTEGER NOT NULL DEFAULT 0
  position    INTEGER NOT NULL

labels
  id          TEXT PK
  name        TEXT NOT NULL
  color       TEXT NOT NULL

task_labels
  task_id     TEXT FK → tasks.id
  label_id    TEXT FK → labels.id
  PRIMARY KEY (task_id, label_id)

snapshots
  id          TEXT PK
  board_id    TEXT FK → boards.id
  state       TEXT NOT NULL                   -- JSON blob (Memento pattern)
  description TEXT
  created_at  TEXT NOT NULL
```

---

## Project Structure

```
backend/
  src/
    index.ts                  # Express app + server startup
    db/
      connection.ts           # SQLite connection via better-sqlite3
      schema.ts               # Drizzle table definitions
    models/                   # OOP classes (this is where patterns live)
      Task.ts                 # Base Task class + Bug/Feature/Story subclasses
      Board.ts                # Board class
      Column.ts               # Column class
    patterns/
      TaskPrototype.ts        # Prototype: clone() logic
      BoardMemento.ts         # Memento: snapshot + history (Caretaker)
      TaskIterator.ts         # Iterator: traversal + filter predicates
    repositories/             # Data access (SRP: only DB queries)
      TaskRepository.ts
      BoardRepository.ts
      ColumnRepository.ts
    services/                 # Business logic (SRP: orchestration)
      TaskService.ts
      BoardService.ts
    routes/                   # Express route definitions
      taskRoutes.ts
      boardRoutes.ts
    middleware/
      errorHandler.ts         # Centralized error handling
    schemas/                  # Zod validation schemas
      taskSchemas.ts
      boardSchemas.ts
  drizzle.config.ts           # Drizzle Kit config for migrations
  tsconfig.json
```

---

## Implementation Steps

### Step 1: Project Setup

**Goal:** Get a TypeScript Express 5 server running with `pnpm dev`.

**Tasks:**
1. Create `tsconfig.json` with strict mode enabled
2. Create `src/index.ts` -- a minimal Express app that listens on port 3001
3. Add scripts to `package.json`: `"dev": "tsx watch src/index.ts"`
4. Run `pnpm dev` and verify you see "Server running on port 3001"

**Hints:**
- Express 5 supports `async` route handlers natively -- rejected promises are caught automatically
- Use `import express from 'express'` (ESM syntax, your package.json already has `"type": "module"`)
- Enable `cors()` middleware for frontend access later

**Resources:**
- Express 5 migration guide: https://expressjs.com/en/guide/migrating-5.html
- tsx docs: https://tsx.is/

---

### Step 2: Database & Drizzle Schema

**Goal:** Define all tables in Drizzle and connect to SQLite.

**Tasks:**
1. Create `src/db/schema.ts` -- define all 7 tables using `sqliteTable()` from `drizzle-orm/sqlite-core`
2. Create `src/db/connection.ts` -- initialize `better-sqlite3` and pass it to `drizzle()`
3. Create `drizzle.config.ts` at the backend root for Drizzle Kit
4. Run `pnpm drizzle-kit generate` to create migration SQL files
5. Run `pnpm drizzle-kit migrate` to apply them (this creates the `.db` file automatically)

**Hints:**
- SQLite stores booleans as integers. Use `integer('col', { mode: 'boolean' })` in Drizzle
- SQLite has no native date type. Store dates as ISO strings in `text` columns
- Use `crypto.randomUUID()` for IDs (built into Node.js, no package needed)
- For foreign keys, use `.references(() => otherTable.id)` in Drizzle

**Resources:**
- Drizzle + SQLite getting started: https://orm.drizzle.team/docs/get-started/sqlite-new
- Drizzle SQLite column types: https://orm.drizzle.team/docs/column-types/sqlite
- Drizzle migrations: https://orm.drizzle.team/docs/migrations

---

### Step 3: OOP Models (Class, Objects, Encapsulation, Abstraction)

**Goal:** Create TypeScript classes that represent your domain. This is where OOP fundamentals are practiced.

**Tasks:**
1. Create `Task` class with private fields, getters/setters, and a constructor
2. Create subclasses `Bug`, `Feature`, `Story` that extend `Task` (OCP)
3. Create an `abstract TaskTemplate` class with an abstract `createDefault()` method (Abstraction)
4. Create `Board` and `Column` classes

**Hints -- Encapsulation:**
- Make fields `private` and expose them through getters
- Setters should validate (e.g., priority must be 'low' | 'medium' | 'high')
- The outside world interacts with controlled methods, not raw data

**Hints -- Abstraction:**
- `TaskTemplate` is an abstract class -- it defines *what* a template does, not *how*
- Each subclass (`BugTemplate`, `FeatureTemplate`) implements `createDefault()` differently
- Think: the caller doesn't need to know which specific template they're using

**Hints -- OCP (Open/Closed Principle):**
- `Task` is the base class. To add a new type, you create a new subclass -- you never modify `Task` itself
- Each subclass can override methods (e.g., `Bug` might have a `severity` field that `Feature` doesn't)
- Use the `type` discriminator field to know which subclass to instantiate from DB rows

**Resources:**
- OOP in TypeScript (all 4 pillars): https://www.freecodecamp.org/news/learn-object-oriented-programming-in-typescript/
- TypeScript classes: https://www.typescriptlang.org/docs/handbook/2/classes.html
- Your theory reference: `oop-expert-with-typescript.md` in the repo root

---

### Step 4: Prototype Pattern -- `clone()`

**Goal:** Implement the Prototype pattern so tasks can be deep-cloned from templates.

**Tasks:**
1. Create a `Cloneable` interface with a `clone(): Task` method
2. Implement `clone()` on the `Task` class -- it must deep-copy the task, its subtasks, AND its labels
3. Cloned tasks get new UUIDs, `isTemplate: false`, and a fresh `createdAt`
4. Create an API endpoint: `POST /tasks/:id/clone` that clones a task and saves the copy

**Hints:**
- Don't use `structuredClone()` here -- it strips class prototypes. Implement `clone()` manually so the result is still a `Task` instance (or `Bug`, `Feature`, etc.)
- The clone must be a **deep copy** -- changing a subtask on the clone must NOT affect the original
- Think about what changes (id, createdAt) vs. what stays the same (title, description, priority)
- Template tasks (`isTemplate: true`) are prototypes that users clone from -- they live in a "Templates" section

**Resources:**
- Refactoring.guru Prototype: https://refactoring.guru/design-patterns/prototype
- Refactoring.guru Prototype in TypeScript: https://refactoring.guru/design-patterns/prototype/typescript/example
- MDN structuredClone (for understanding why NOT to use it here): https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone

---

### Step 5: Memento Pattern -- Board Snapshots

**Goal:** Implement save/restore of board state for undo/redo.

**Three roles in the Memento pattern:**
1. **Originator** (`Board`) -- the object whose state you want to save. Has `createSnapshot()` and `restore(snapshot)` methods
2. **Memento** (`BoardSnapshot`) -- an immutable snapshot of the board's state at a point in time. Stores serialized state as JSON
3. **Caretaker** (`BoardHistory`) -- manages the stack of mementos. Has `save()`, `undo()`, `redo()` methods

**Tasks:**
1. Create `BoardSnapshot` class (the Memento) -- holds serialized board state + metadata
2. Add `createSnapshot(): BoardSnapshot` to `Board` (the Originator)
3. Add `restore(snapshot: BoardSnapshot): void` to `Board`
4. Create `BoardHistory` class (the Caretaker) -- manages undo/redo stacks
5. Create API endpoints:
   - `POST /boards/:id/snapshots` -- save current state
   - `POST /boards/:id/undo` -- restore previous state
   - `GET /boards/:id/snapshots` -- list saved snapshots

**Hints:**
- The Memento should store the **entire** board state (columns, tasks, subtasks, labels) as a JSON string in the `snapshots` table
- The Caretaker never peeks inside the Memento -- it just stores and retrieves them
- For undo: pop from the undo stack, push current state to redo stack, restore
- Be careful: restoring means replacing ALL columns/tasks in the DB with the snapshot's data

**Resources:**
- Refactoring.guru Memento: https://refactoring.guru/design-patterns/memento
- SBCode Memento in TypeScript: https://sbcode.net/typescript/memento/
- JitBlox undo/redo in TypeScript: https://www.jitblox.com/blog/designing-a-lightweight-undo-history-with-typescript

---

### Step 6: Iterator Pattern -- Task Traversal

**Goal:** Create a custom iterator that traverses tasks across all columns with filter predicates.

**Tasks:**
1. Create a `TaskIterator` class that implements the `Iterable<Task>` protocol (via `Symbol.iterator`)
2. Support filter predicates: by priority, by assignee, by due date range, by type, by label
3. Use generator functions (`function*` + `yield`) for clean iteration
4. Create API endpoints that use the iterator:
   - `GET /boards/:id/tasks?priority=high&assignee=alice` -- filtered task list
   - `GET /boards/:id/tasks/overdue` -- tasks past due date

**Hints:**
- Implement `[Symbol.iterator]()` so you can use `for...of` on your iterator
- Generator functions (`function*`) make iterators much cleaner than manual `next()` implementations
- The iterator should work across ALL columns in a board -- it flattens the board structure
- Filter predicates can be composed: `new TaskIterator(tasks).filterBy({ priority: 'high', assignee: 'alice' })`
- This is lazy evaluation -- tasks are yielded one at a time, not collected into an array first

**Resources:**
- TypeScript Handbook -- Iterators and Generators: https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
- MDN Iterators and Generators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators
- Carlos Caballero -- Iterator Pattern with Symbol.iterator: https://www.carloscaballero.io/understanding-iterator-pattern-in-javascript-typescript-using-symbol-iterator/

---

### Step 7: Repositories (SRP)

**Goal:** Create data access classes that handle ONLY database operations.

**Tasks:**
1. `TaskRepository` -- CRUD operations for tasks, subtasks, labels, task_labels
2. `BoardRepository` -- CRUD for boards, plus fetching full board state (for Memento)
3. `ColumnRepository` -- CRUD for columns

**Hints:**
- Repositories use Drizzle's query API: `db.select().from(tasks).where(eq(tasks.id, id))`
- Each repository does ONE thing: translate between your OOP models and DB rows (SRP)
- The repository returns domain objects (`Task` instances), not raw DB rows
- Use Drizzle's relational queries for joins (e.g., tasks with their subtasks and labels)

**Resources:**
- Drizzle queries: https://orm.drizzle.team/docs/select
- Drizzle relations: https://orm.drizzle.team/docs/relations

---

### Step 8: Services (SRP)

**Goal:** Create service classes that hold business logic, orchestrating repositories and patterns.

**Tasks:**
1. `TaskService` -- uses `TaskRepository` + Prototype pattern for cloning
2. `BoardService` -- uses `BoardRepository` + Memento pattern for snapshots + Iterator for filtering

**Hints:**
- Services don't know about HTTP (no `req`/`res`) -- they take plain arguments and return domain objects
- Services don't write SQL -- they call repositories
- This is SRP in action: routes handle HTTP, services handle logic, repositories handle data

---

### Step 9: Routes & Validation

**Goal:** Wire up Express routes with Zod validation.

**API Endpoints:**
```
Boards:
  POST   /boards                    Create board (with default columns)
  GET    /boards                    List boards
  GET    /boards/:id                Get board with columns and tasks
  PUT    /boards/:id                Update board
  DELETE /boards/:id                Delete board

Board Snapshots (Memento):
  POST   /boards/:id/snapshots      Save snapshot
  GET    /boards/:id/snapshots      List snapshots
  POST   /boards/:id/undo           Undo to previous snapshot
  POST   /boards/:id/redo           Redo

Board Tasks (Iterator):
  GET    /boards/:id/tasks          Filtered task list (?priority, ?assignee, ?type, ?label)

Columns:
  POST   /boards/:boardId/columns   Create column
  PUT    /columns/:id               Update column
  PATCH  /columns/reorder           Reorder columns
  DELETE /columns/:id               Delete column

Tasks:
  POST   /columns/:columnId/tasks   Create task in column
  GET    /tasks/:id                 Get task with subtasks + labels
  PUT    /tasks/:id                 Update task
  DELETE /tasks/:id                 Delete task
  PATCH  /tasks/:id/move            Move task to different column
  POST   /tasks/:id/clone           Clone task (Prototype)

Subtasks:
  POST   /tasks/:taskId/subtasks    Create subtask
  PUT    /subtasks/:id              Update subtask
  DELETE /subtasks/:id              Delete subtask

Labels:
  POST   /labels                    Create label
  GET    /labels                    List labels
  POST   /tasks/:taskId/labels      Attach label to task
  DELETE /tasks/:taskId/labels/:labelId  Detach label
```

**Hints:**
- Define Zod schemas for each request body (`createTaskSchema`, `updateBoardSchema`, etc.)
- Validate in a middleware or at the top of each route handler
- Express 5 catches async errors automatically -- no need for `try/catch` wrappers in routes
- Return consistent response shapes: `{ data: T }` for success, `{ error: { code, message } }` for errors

**Resources:**
- Zod docs: https://zod.dev/
- Express 5 routing: https://expressjs.com/en/guide/routing.html

---

### Step 10: Error Handling & Middleware

**Goal:** Centralized error handling.

**Tasks:**
1. Create custom error classes (`NotFoundError`, `ValidationError`)
2. Create an error-handling middleware that catches all errors and returns consistent JSON

**Hints:**
- Express error middleware has 4 params: `(err, req, res, next)`
- Map your custom errors to HTTP status codes (404, 400, etc.)
- Never expose stack traces in responses

---

### Step 11: Frontend (React + Vite)

**Goal:** Build a Kanban board UI that exercises all the backend patterns.

This is last because the frontend is a thin layer over the API. The OOP learning happens in the backend.

**Key UI features:**
- Board view with draggable columns and tasks
- Task detail modal (edit, view subtasks, manage labels)
- "Clone from template" button (triggers Prototype)
- Undo/Redo buttons (triggers Memento)
- Filter bar (triggers Iterator)

**Resources:**
- Vite + React setup: https://vite.dev/guide/
- React docs: https://react.dev/

---

## Recommended Implementation Order

```
Step 1  → Project setup (get pnpm dev working)
Step 2  → Database schema (Drizzle tables + migrations)
Step 3  → OOP models (Task, Board, Column classes) ← core OOP learning
Step 4  → Prototype pattern (clone) ← first pattern
Step 5  → Memento pattern (snapshots) ← second pattern
Step 6  → Iterator pattern (traversal) ← third pattern
Step 7  → Repositories (wire models to DB)
Step 8  → Services (wire patterns to repositories)
Step 9  → Routes & validation (expose via API)
Step 10 → Error handling
Step 11 → Frontend
```

Steps 3-6 are where the OOP learning happens. Spend the most time there.

---

## General Learning Resources

| Topic | Resource |
|-------|----------|
| OOP in TypeScript (all 4 pillars) | https://www.freecodecamp.org/news/learn-object-oriented-programming-in-typescript/ |
| Design Patterns (all 23, interactive) | https://refactoring.guru/design-patterns |
| TypeScript classes handbook | https://www.typescriptlang.org/docs/handbook/2/classes.html |
| Theory reference (in this repo) | `../../oop-expert-with-typescript.md` |
| Drizzle ORM docs | https://orm.drizzle.team/ |
| Express 5 docs | https://expressjs.com/ |
| Zod validation | https://zod.dev/ |
