# TaskFlow Frontend

React 19 Kanban UI for the TaskFlow backend. Uses React Router v7 in framework mode with SSR, Tailwind v4, and shadcn/ui components.

## Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI (with React Compiler enabled) |
| Vite 8 | Dev server + build |
| React Router v7 | Routing + data loading + actions (framework mode, SSR) |
| Tailwind CSS v4 | Styling (CSS-first config, no `tailwind.config.js`) |
| shadcn/ui + Radix | Accessible component primitives |
| Zod v4 | Client-side form validation |
| Oxanium | Display font (variable) |

## Structure

Domain-driven layout: each backend resource has its own module under `src/modules/` with components, entities, schemas, api, and actions colocated. Cross-cutting code lives under `src/shared/`.

```
src/
├── modules/                  # Domain modules
│   ├── boards/
│   │   ├── components/       # BoardList, BoardView, CreateBoardForm
│   │   ├── entities/         # board.ts, snapshot.ts
│   │   ├── actions.ts        # handleCreateBoard
│   │   ├── api.ts            # Board CRUD + snapshots + tasks + columns
│   │   └── schemas.ts        # Zod + derived DTOs
│   ├── columns/
│   │   ├── components/       # ColumnView, CreateColumnForm
│   │   ├── entities/         # column.ts
│   │   ├── actions.ts        # handleCreateColumn(formData, boardId)
│   │   ├── api.ts
│   │   └── schemas.ts
│   ├── tasks/
│   │   ├── components/       # TaskTile, TaskDetails, CreateTaskForm, EditTaskForm
│   │   ├── entities/         # task.ts
│   │   ├── actions.ts        # handleCreateTask, handleCloneTask, handleEditTask, handleDeleteTask
│   │   ├── api.ts
│   │   └── schemas.ts
│   ├── subtasks/
│   │   ├── components/       # SubtaskList (fetch + useOptimistic + CRUD UI)
│   │   ├── entities/         # subtask.ts
│   │   └── api.ts
│   └── labels/
│       ├── components/       # TaskLabelList (fetch + colored pills)
│       ├── entities/         # label.ts, taskLabel.ts
│       └── api.ts
├── shared/                   # Cross-cutting (no domain)
│   ├── api/
│   │   ├── client.ts         # Base get/post/put/patch/del with typed generics
│   │   └── endpoints.ts      # Centralized URL constants
│   ├── components/
│   │   ├── forms/            # RequiredIndicator
│   │   ├── modal/            # Modal + ConfirmModal (reusable confirm dialog)
│   │   └── ui/               # shadcn primitives (Button, Checkbox, Input, Select, etc.)
│   ├── filter/               # Filter bar (not tied to any backend resource)
│   │   ├── components/       # FilterBar
│   │   └── schemas.ts        # FilterSchema + FilterType
│   └── lib/
│       ├── errors/           # ActionError + ActionResult + normalizers
│       ├── formHelpers.ts    # Zod helpers: optionalString, optionalDate, checkbox, optionalFilterString
│       └── utils.ts          # cn() helper (clsx + tailwind-merge)
├── pages/                    # Route modules (loader + action + component)
│   ├── HomePage.tsx
│   └── BoardPage.tsx
├── routes/                   # Resource routes (loader-only, no component)
│   ├── api.tasks.$id.subtasks.tsx
│   └── api.tasks.$id.labels.tsx
├── entry.client.tsx          # Hydration (hydrateRoot + HydratedRouter)
├── entry.server.tsx          # Streaming SSR (renderToPipeableStream)
├── root.tsx                  # Layout + shared ErrorBoundary
├── routes.ts                 # Route config (routes() / index() helpers)
└── index.css                 # Tailwind + shadcn theme tokens
```

### Import rules

- `modules/<a>/*` **may** import from `shared/*` and from its own submodules
- `modules/<a>/*` **may** import from `modules/<b>/*` through its public files (api, entities, schemas)
- `shared/*` **never** imports from `modules/*`
- `pages/*` and `routes/*` orchestrate everything: they import from both `modules/*` and `shared/*`

## Key Patterns

### Data Fetching via Loaders

Loaders run before components render. In SSR mode they run on the server for the initial request, then on the client for subsequent navigations.

```ts
export async function loader({ params }: Route.LoaderArgs) {
  const [board, columns, tasks] = await Promise.all([
    getBoard(params.id),
    getBoardColumns(params.id),
    getBoardTasks(params.id, {}),
  ])
  if (!board) throw data('Board Not Found', { status: 404 })
  return { board, columns, tasks }
}
```

### Mutations via `useFetcher` + actions

Forms submit to the current route's `action` export without navigating. After the action completes, React Router revalidates the loader automatically.

```ts
const fetcher = useFetcher<ActionResult<Column>>()
// submits to BoardPage's action; loader re-runs; UI updates
<fetcher.Form method="post">{/* ... */}</fetcher.Form>
```

### Typed `ActionResult<T>`

Discriminated union for action return values. Narrows cleanly based on `ok`:

```ts
type ActionResult<T> = { ok: true; data?: T } | { ok: false; error: ActionError }
```

`ActionError` carries optional `formError` (form-level message) and `fieldErrors` (per-field messages). Zod issues are normalized via `zodErrorToActionError`; unknown errors via `toActionError`.

### Error Boundary

Exported from `root.tsx`. Catches route errors:
- `isRouteErrorResponse(error)` → formatted HTTP error
- `error instanceof Error` → stack trace (dev)
- Unknown → fallback

### Frontend Schemas ≠ Backend Schemas

Frontend Zod schemas validate **user input only** (e.g., `{ name }` for create-column). The backend validates the full API contract again. Actions enrich input with URL params (e.g., `boardId`) before calling the API.

### Form Helpers (`lib/formHelpers.ts`)

HTML forms send `""` for empty inputs and omit unchecked checkboxes, which mismatches backend DTO types. The helpers use `z.pipe(z.transform(...), z.nullable/boolean(...))` to normalize:

- `optionalString` — `""` → `null`, else `string`
- `optionalDate` — `""` → `null`, else ISO date string
- `checkbox` — `"on" | true` → `true`, else `false`

Used in `CreateTaskSchema` for optional `assignee` / `description` / `dueDate` fields and the `isTemplate` checkbox.

### Resource Routes (subtasks + labels)

Routes that export only a `loader` (no default component). Used for on-demand data loads from client components via `useFetcher().load()`:

- `/api/tasks/:id/subtasks` → `routes/api.tasks.$id.subtasks.tsx`
- `/api/tasks/:id/labels` → `routes/api.tasks.$id.labels.tsx`

Registered explicitly in `routes.ts`. Called by `SubtaskList` / `TaskLabelList` on mount via `useEffect` + `fetcher.load()`.

### Mutation Pattern Split

Not all mutations go through server actions. The split:

- **Optimistic, scope-local mutations** → direct API calls wrapped in `startTransition`, tracked with `useOptimistic`.
  Example: subtask toggle/delete/create/inline-edit in `SubtaskList`.
  Reason: `fetcher.submit()` is fire-and-forget (not awaitable), so `useOptimistic` inside a sync `startTransition` would snap back before the mutation completes. Direct API calls are awaitable.

- **Navigational or form mutations** → `fetcher.submit({ intent, ... })` to `BoardPage.action` or `HomePage.action`, handled by `modules/<domain>/actions.ts`.
  Example: create-board, create-column, create-task, clone-task, edit-task, delete-task.
  Reason: benefits from intent dispatch, typed `ActionResult<T>`, and automatic loader revalidation.

### Reusable Confirm Dialog

`shared/components/modal/ConfirmModal.tsx` composes `Modal` with a fixed content shape: title, message, confirm/cancel buttons. Takes `variant: 'default' | 'destructive'`, `isPending`, and `onConfirm` callback. Used for Task Delete confirm and Edit Discard prompt.

### Task Edit Mode

`TaskDetails` swaps between read and edit modes via `isEditing` state. Edit mode renders `EditTaskForm` (mirrors `CreateTaskForm` layout with `defaultValue` on each field). Dirty state is tracked via `<form onChange>` callback that the form reports back to the parent; Cancel with dirty changes opens a discard `ConfirmModal`.

### Optimistic Updates (`useOptimistic` + `useTransition`)

Subtask toggle uses React 19's `useOptimistic` inside a `startTransition`. The flow:

1. `addOptimistic(id)` → UI updates instantly (reducer toggles `isComplete`)
2. `await updateSubtask(id, { isComplete })` → PATCH to backend
3. `fetcher.load(...)` → re-fetch the canonical subtasks list
4. Transition ends → optimistic state discards, real state takes over

If the API throws, the transition ends without the real state updating → optimistic state auto-reverts.

### URL-driven Modals

The task detail modal opens via `?task=<id>` search param, not component state. `BoardView` reads `useSearchParams()` and renders the modal when the param matches a task. The `closeTaskDetails` callback (which clears the param) is passed as a prop to both `Modal` and `TaskDetails`, so children don't manipulate the URL directly. This makes task URLs deep-linkable and shareable — refreshing the page keeps the modal open.

### Programmatic Mutations via `fetcher.submit()`

For non-form mutations (e.g., clone button click), use `fetcher.submit()` with a plain object that React Router serializes to `FormData`:

```ts
cloneFetcher.submit(
  { intent: 'clone-task', id: task.id },
  { method: 'POST' },
)
```

The board's `action` switches on `intent` to route between `create-column`, `create-task`, and `clone-task` handlers. Pattern scales well as more mutations are added.

## Commands

```bash
pnpm dev      # Dev server on :5173
pnpm build    # tsc + vite build
pnpm preview  # Preview production build
pnpm lint     # ESLint
```

## Config Files

- `react-router.config.ts` -- `ssr: true`, `appDirectory: 'src'`, prerender `/`
- `vite.config.ts` -- React Router plugin + React Compiler (via Babel) + Tailwind
- `tsconfig.app.json` -- includes `.react-router/types/**/*` for typed route modules
- `.react-router/types/` -- auto-generated by dev server (types for loaders/params)

## Backend Dependency

The frontend calls `http://localhost:3001` by default. Override via `VITE_API_URL` env var. Ensure the backend is running (`cd ../backend && pnpm dev`) before starting the frontend.
