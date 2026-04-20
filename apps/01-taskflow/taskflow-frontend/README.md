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

```
src/
├── api/                      # Fetch wrappers + resource functions
│   ├── client.ts             # Base get/post/put/patch/del with typed generics
│   ├── endpoints.ts          # Centralized URL constants
│   ├── boardApi.ts           # Board CRUD + snapshots + tasks + columns
│   ├── taskApi.ts            # Task CRUD + clone + subtasks + labels
│   ├── columnApi.ts          # Column CRUD
│   ├── subtaskApi.ts         # Subtask CRUD
│   └── labelApi.ts           # Label list + create
├── components/
│   ├── boards/               # BoardList, BoardView
│   ├── columns/              # ColumnView (task details modal hosted here via ?task= search param)
│   ├── tasks/                # TaskTile, TaskDetails
│   ├── form/                 # CreateBoardForm, CreateColumnForm, CreateTaskForm, RequiredIndicator
│   ├── modal/                # Modal (backdrop + click-outside-to-close)
│   └── ui/                   # shadcn primitives (Button, Checkbox, Input, Select, etc.)
├── lib/
│   ├── errors/               # ActionError + ActionResult + normalizers
│   ├── formHelpers.ts        # Zod helpers: optionalString, optionalDate, checkbox
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── pages/                    # Route modules (loader + action + component)
├── routes/                   # Resource routes (loader-only, no component)
│   ├── api.tasks.$id.subtasks.tsx
│   └── api.tasks.$id.labels.tsx
├── schemas/                  # Frontend Zod schemas (form input only)
├── types/                    # Plain-object types mirroring backend DTOs
├── entry.client.tsx          # Hydration (hydrateRoot + HydratedRouter)
├── entry.server.tsx          # Streaming SSR (renderToPipeableStream)
├── root.tsx                  # Layout + shared ErrorBoundary
├── routes.ts                 # Route config (routes() / index() helpers)
└── index.css                 # Tailwind + shadcn theme tokens
```

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

Registered explicitly in `routes.ts`. The `TaskDetails` modal calls them on mount via `useEffect` + `fetcher.load()`.

### Optimistic Updates (`useOptimistic` + `useTransition`)

Subtask toggle uses React 19's `useOptimistic` inside a `startTransition`. The flow:

1. `addOptimistic(id)` → UI updates instantly (reducer toggles `isComplete`)
2. `await updateSubtask(id, { isComplete })` → PATCH to backend
3. `fetcher.load(...)` → re-fetch the canonical subtasks list
4. Transition ends → optimistic state discards, real state takes over

If the API throws, the transition ends without the real state updating → optimistic state auto-reverts.

### URL-driven Modals

The task detail modal opens via `?task=<id>` search param, not component state. `ColumnView` reads `useSearchParams()` and renders the modal when the param matches a task in its column. This makes task URLs deep-linkable and shareable — refreshing the page keeps the modal open.

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
