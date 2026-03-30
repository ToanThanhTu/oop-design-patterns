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
  updated_at  TEXT NOT NULL

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
  updated_at  TEXT NOT NULL
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
- Use `better-sqlite3` as the driver, NOT `@libsql/client`. For local-only SQLite, better-sqlite3 is ~50-130x faster. libsql is designed for remote/distributed use (Turso)
- Import from `drizzle-orm/better-sqlite3` (not `drizzle-orm/libsql`)
- `connection.ts` should create a `Database` instance from `better-sqlite3`, then wrap it with `drizzle()`
- `drizzle.config.ts` dialect should be `"sqlite"` with `dbCredentials: { url: "./data/taskflow.db" }`
- SQLite stores booleans as integers. Use `integer('col', { mode: 'boolean' })` in Drizzle
- SQLite has no native date type. Store dates as ISO strings in `text` columns
- Use `crypto.randomUUID()` for IDs (built into Node.js, no package needed)
- For foreign keys, use `.references(() => otherTable.id)` in Drizzle
- Add `*.db` to `.gitignore` -- don't commit the database file

**Resources:**
- Drizzle + better-sqlite3 getting started: https://orm.drizzle.team/docs/get-started/sqlite-new
- Drizzle SQLite column types: https://orm.drizzle.team/docs/column-types/sqlite
- Drizzle migrations: https://orm.drizzle.team/docs/migrations
- better-sqlite3 API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

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

### Step 11: Frontend Setup (React + Vite + TypeScript)

**Goal:** Scaffold a React project and establish the foundation.

**Tasks:**
1. Run `pnpm create vite .` inside `frontend/` -- choose React + TypeScript + SWC
2. Install Tailwind CSS v4 and configure it
3. Install React Router for client-side routing
4. Set up a project structure (see below)
5. Create an API client module for all backend calls
6. Run `pnpm dev` and verify the Vite dev server starts

**Project Structure:**
```
frontend/
  src/
    api/                  # API client functions (one file per resource)
      boardApi.ts
      taskApi.ts
      columnApi.ts
      subtaskApi.ts
      labelApi.ts
    components/           # Reusable UI components
      ui/                 # Generic UI (Button, Modal, Input, etc.)
      board/              # Board-specific components
      task/               # Task-specific components
    hooks/                # Custom React hooks
    pages/                # Route-level page components
      BoardListPage.tsx
      BoardPage.tsx
    types/                # Shared TypeScript types (mirrors backend DTOs)
    App.tsx               # Router + layout
    main.tsx              # Entry point
```

**Hints -- API Client:**
- Create a base `fetch` wrapper that handles `Content-Type: application/json`, error parsing, and the base URL
- Each API file exports functions like `getBoards()`, `createBoard(data)`, etc.
- Keep API logic separate from components -- components call hooks, hooks call API functions
- Store the API base URL in an environment variable (`VITE_API_URL`)

**Hints -- Tailwind CSS:**
- Tailwind v4 uses a CSS-first config approach -- no `tailwind.config.js` needed
- Import Tailwind in your main CSS file with `@import "tailwindcss"`
- Use `cn()` helper (clsx + tailwind-merge) for conditional class composition

**React Concepts to Review:**
- **JSX** -- it's syntactic sugar for `React.createElement()`. Understand what JSX compiles to
- **Components** -- functions that return JSX. Props flow down, events flow up
- **Strict Mode** -- `<React.StrictMode>` in `main.tsx` intentionally double-renders in dev to catch bugs. Don't remove it

**Resources:**
- Vite + React setup: https://vite.dev/guide/
- React Quick Start: https://react.dev/learn
- Tailwind CSS v4 installation: https://tailwindcss.com/docs/installation/vite
- React Router v7 docs: https://reactrouter.com/start/framework/installation

---

### Step 12: Routing & Layout

**Goal:** Set up client-side routing and the app shell.

**Tasks:**
1. Configure React Router with routes for board list and board detail
2. Create a root layout component with a header/navbar
3. Create placeholder page components (`BoardListPage`, `BoardPage`)
4. Verify navigation works between pages

**Routes:**
```
/                → BoardListPage (list all boards)
/boards/:id      → BoardPage (Kanban board view)
```

**Hints -- React Router:**
- Use `createBrowserRouter` + `RouterProvider` for the modern approach
- Use `useParams()` to read `:id` from the URL
- Use `useNavigate()` for programmatic navigation
- Use `<Link>` instead of `<a>` for client-side navigation (no full page reload)
- Use `<Outlet />` in layout components to render child routes

**React Concepts to Review:**
- **Conditional Rendering** -- `{condition && <Component />}` or ternary `{condition ? <A /> : <B />}`
- **Lists & Keys** -- always provide a unique `key` prop when rendering lists with `.map()`. Keys help React identify which items changed

**Resources:**
- React Router tutorial: https://reactrouter.com/start/framework/routing
- React Conditional Rendering: https://react.dev/learn/conditional-rendering
- React Lists and Keys: https://react.dev/learn/rendering-lists

---

### Step 13: State Management & Data Fetching

**Goal:** Fetch data from your backend API and manage it in React state.

**Tasks:**
1. Fetch and display the list of boards on `BoardListPage`
2. Fetch and display board details (columns + tasks) on `BoardPage`
3. Handle loading, error, and empty states for all data fetching
4. Create a board and navigate to it

**Hints -- useState & useEffect:**
- `useState` holds local component state. The setter triggers a re-render
- `useEffect` runs side effects after render. Use it for data fetching (for now)
- Always include a cleanup function in `useEffect` when setting up subscriptions
- The dependency array controls when the effect re-runs: `[]` = once on mount, `[id]` = when `id` changes

**Hints -- Data Fetching Pattern:**
```
1. Set loading state → true
2. Call API function
3. On success → set data, set loading → false
4. On error → set error state, set loading → false
```
- Extract this pattern into a custom hook (e.g., `useApi` or `useFetch`) to avoid repeating it
- Show a loading spinner or skeleton while data is loading
- Show an error message with a retry button on failure

**Hints -- Lifting State:**
- When sibling components need the same data, lift the state to their common parent
- Pass data down as props, pass update functions down as callbacks
- Don't lift state higher than necessary -- keep it as close to where it's used as possible

**React Concepts to Review:**
- **useState** -- immutable updates. Never mutate state directly. For arrays: `setItems([...items, newItem])`, not `items.push(newItem)`
- **useEffect** -- the mental model is synchronization, not lifecycle. "Keep this in sync with that"
- **Derived State** -- if a value can be computed from existing state/props, don't store it in `useState`. Just compute it during render
- **Rendering** -- React re-renders when state changes. A re-render ≠ a DOM update. React diffs the virtual DOM and only updates what changed

**Resources:**
- React useState: https://react.dev/reference/react/useState
- React useEffect: https://react.dev/reference/react/useEffect
- You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- Thinking in React: https://react.dev/learn/thinking-in-react

---

### Step 14: Board View -- Columns & Tasks (Kanban Layout)

**Goal:** Build the core Kanban board UI with columns and task cards.

**Tasks:**
1. Create a `BoardColumn` component that displays a column with its tasks
2. Create a `TaskCard` component for individual tasks in a column
3. Layout columns horizontally (flexbox or grid, scrollable if many columns)
4. Display task metadata on cards (title, priority badge, assignee, labels)
5. Add "Create Column" and "Create Task" functionality with forms

**Hints -- Component Composition:**
- `BoardPage` → fetches data, passes to children
- `BoardColumn` → receives column + tasks as props, renders task cards
- `TaskCard` → receives a single task as props, renders the card UI
- Keep components small and focused. If a component does too many things, split it

**Hints -- Forms:**
- Use controlled components: input value comes from state, onChange updates state
- For simple forms (create board, create column), inline state is fine
- For complex forms (create/edit task with many fields), consider React Hook Form + Zod
- Validate on submit, show inline error messages

**Hints -- Prop Drilling vs Context:**
- Passing props 2-3 levels deep is fine. Don't reach for Context too early
- If you find yourself passing the same data through 4+ levels, consider Context or restructuring
- Context is for "global-ish" data: current user, theme, locale -- not for every piece of state

**React Concepts to Review:**
- **Props** -- read-only data passed from parent to child. Think of them as function arguments
- **Children** -- `props.children` lets you compose components like HTML elements
- **Controlled vs Uncontrolled** -- controlled = React owns the value (via state), uncontrolled = DOM owns it (via ref). Prefer controlled for forms
- **Composition over Inheritance** -- React favors composition. Use props and children to customize behavior, not class hierarchies

**Resources:**
- React Props: https://react.dev/learn/passing-props-to-a-component
- React Forms: https://react.dev/reference/react-dom/components/input
- React Context: https://react.dev/learn/passing-data-deeply-with-context
- React Hook Form: https://react-hook-form.com/get-started
- Zod + React Hook Form: https://react-hook-form.com/get-started#SchemaValidation

---

### Step 15: Task Detail Modal

**Goal:** Build a modal for viewing and editing task details, subtasks, and labels.

**Tasks:**
1. Create a `Modal` component (reusable, renders via portal)
2. Create a `TaskDetailModal` that shows full task info
3. Add inline editing for task fields (title, description, priority, assignee, due date)
4. Display and manage subtasks (add, toggle complete, delete)
5. Display and manage labels (attach, detach)

**Hints -- Modals:**
- Use `createPortal()` to render the modal at the document root (avoids z-index/overflow issues)
- Close on backdrop click and Escape key
- Trap focus inside the modal for accessibility
- Control open/close state in the parent component, not the modal itself

**Hints -- Optimistic Updates:**
- When the user toggles a subtask, update the UI immediately, then sync with the backend
- If the API call fails, revert the optimistic update and show an error
- This makes the UI feel instant instead of waiting for network round-trips

**React Concepts to Review:**
- **useRef** -- for DOM references (focus management in modals), or mutable values that don't trigger re-renders
- **Portals** -- `createPortal(jsx, domNode)` renders children outside the parent DOM hierarchy while preserving React context
- **Event Handling** -- `onClick`, `onSubmit`, `onKeyDown`. Always `e.preventDefault()` on form submit. Event handlers receive synthetic events
- **Callback Props** -- pass functions from parent to child: `<TaskCard onEdit={handleEdit} />`. The child calls it, the parent handles the logic

**Resources:**
- React createPortal: https://react.dev/reference/react-dom/createPortal
- React useRef: https://react.dev/reference/react/useRef
- React Event Handling: https://react.dev/learn/responding-to-events
- Accessible Modals (WAI-ARIA): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

---

### Step 16: Clone from Template (Prototype Pattern UI)

**Goal:** Build the UI for cloning tasks -- the frontend counterpart of the Prototype pattern.

**Tasks:**
1. Add a "Clone" button on task cards (or in the task detail modal)
2. On click, call `POST /tasks/:id/clone`
3. Show the cloned task appear in the same column
4. Add a "Templates" section that lists template tasks (`isTemplate: true`)
5. Allow cloning from templates into a target column

**Hints:**
- The backend does all the heavy lifting (deep copy of subtasks + labels). The frontend just calls one endpoint
- After cloning, you need to refresh the task list or optimistically add the new task to the UI
- Consider showing a brief success toast/notification after cloning

**React Concepts to Review:**
- **Updating Arrays in State** -- to add a cloned task: `setTasks(prev => [...prev, clonedTask])`. Never mutate
- **useMemo** -- if you're filtering template vs non-template tasks for display, `useMemo` avoids recomputing on every render. But only use it if you measure a benefit

**Resources:**
- React Updating Arrays in State: https://react.dev/learn/updating-arrays-in-state
- React useMemo: https://react.dev/reference/react/useMemo

---

### Step 17: Undo/Redo (Memento Pattern UI)

**Goal:** Build undo/redo controls that exercise the Memento pattern.

**Tasks:**
1. Add Undo and Redo buttons to the board header
2. Add a "Save Snapshot" button with an optional description input
3. On Undo → call `POST /boards/:id/undo`, refresh the board
4. On Redo → call `POST /boards/:id/redo`, refresh the board
5. Show snapshot history list (`GET /boards/:id/snapshots`)
6. Disable Undo/Redo buttons when there's nothing to undo/redo

**Hints:**
- After undo/redo, the entire board state changes (columns, tasks, subtasks, labels). Refetch everything
- The disabled state of undo/redo buttons is tricky -- your backend doesn't expose "can undo?" directly. Options: track it client-side, or just handle the 400 error gracefully
- Show a confirmation before undo -- "This will revert to the previous saved state"

**React Concepts to Review:**
- **useCallback** -- if you're passing undo/redo handlers to child components, `useCallback` prevents unnecessary re-renders of those children. Same rule as `useMemo`: only if needed
- **Conditional Disabling** -- `<button disabled={!canUndo}>Undo</button>`. Disabled buttons should look visually different (lower opacity, no hover effects)

**Resources:**
- React useCallback: https://react.dev/reference/react/useCallback

---

### Step 18: Filter Bar (Iterator Pattern UI)

**Goal:** Build a filter UI that exercises the Iterator pattern on the backend.

**Tasks:**
1. Create a `FilterBar` component with dropdowns/inputs for: priority, assignee, type, label, due date range
2. On filter change, call `GET /boards/:id/tasks?priority=high&assignee=alice...`
3. Display filtered results (replace the normal column view with a flat filtered list, or highlight matching tasks)
4. Add a "Clear Filters" button to reset
5. Show the active filter count as a badge

**Hints:**
- Use query parameters for filters. When any filter changes, rebuild the query string and refetch
- Debounce text inputs (assignee name) to avoid firing API calls on every keystroke
- The filtered view could be a separate mode: "Board View" (columns) vs "Filter View" (flat list)

**React Concepts to Review:**
- **Custom Hooks** -- extract the filter logic into `useTaskFilters()` that manages filter state and returns `{ filters, setFilter, clearFilters, filteredTasks }`
- **Debouncing** -- delay API calls until the user stops typing. Implement with `setTimeout` in a `useEffect`, or use a `useDebouncedValue` hook
- **URL State** -- consider syncing filters to the URL query string so filtered views are shareable/bookmarkable. Use `useSearchParams()` from React Router

**Resources:**
- React Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
- React Router useSearchParams: https://reactrouter.com/en/main/hooks/use-search-params
- Debounce pattern: https://usehooks.com/usedebounce

---

### Step 19: Polish & Accessibility

**Goal:** Improve UX, handle edge cases, and ensure accessibility basics.

**Tasks:**
1. Add loading skeletons for boards, columns, and tasks
2. Add empty states ("No boards yet", "No tasks in this column")
3. Add error boundaries to catch rendering errors gracefully
4. Add keyboard navigation (Tab through task cards, Enter to open detail)
5. Add proper ARIA labels on interactive elements
6. Add toast notifications for success/error feedback
7. Responsive layout (works on mobile screens)

**Hints -- Error Boundaries:**
- Error boundaries are class components (the one place React still needs classes!)
- They catch errors during rendering, not in event handlers or async code
- Wrap major sections independently so one crash doesn't take down the whole app

**Hints -- Accessibility:**
- Every interactive element must be keyboard accessible
- Use semantic HTML: `<button>` not `<div onClick>`, `<nav>`, `<main>`, `<header>`
- Color is never the only indicator -- add text or icons alongside color badges
- Test with a screen reader (VoiceOver on Mac, NVDA on Windows)

**React Concepts to Review:**
- **Error Boundaries** -- `componentDidCatch` + `getDerivedStateFromError`. The only remaining use case for class components
- **React.Suspense** -- for lazy loading components. `<Suspense fallback={<Spinner />}>`
- **React.lazy** -- code-split routes: `const BoardPage = lazy(() => import('./pages/BoardPage'))`
- **Fragments** -- `<></>` avoids unnecessary wrapper divs in the DOM

**Resources:**
- React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- React Suspense: https://react.dev/reference/react/Suspense
- Web Accessibility (a11y): https://web.dev/learn/accessibility
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

## Recommended Implementation Order

```
Backend:
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

Frontend:
  Step 11 → Project setup (Vite + React + Tailwind)
  Step 12 → Routing & layout
  Step 13 → State management & data fetching ← core React learning
  Step 14 → Board view (columns + tasks) ← main UI
  Step 15 → Task detail modal
  Step 16 → Clone (Prototype pattern UI)
  Step 17 → Undo/Redo (Memento pattern UI)
  Step 18 → Filter bar (Iterator pattern UI)
  Step 19 → Polish & accessibility
```

Steps 3-6 are where the OOP learning happens. Steps 13-15 are where the React learning happens.

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
| React docs (start here) | https://react.dev/learn |
| Thinking in React | https://react.dev/learn/thinking-in-react |
| React hooks reference | https://react.dev/reference/react |
| React Router docs | https://reactrouter.com/ |
| Tailwind CSS docs | https://tailwindcss.com/docs |
| Vite docs | https://vite.dev/guide/ |
