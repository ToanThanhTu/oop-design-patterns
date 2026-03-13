# TaskFlow -- Task Management Board

A Kanban-style task board where users create, organize, and track tasks across columns (To Do, In Progress, Done). Tasks can be cloned from templates, and the board state can be saved and restored.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Express.js |
| Database | SQLite |

## Concepts Covered

### OOP Fundamentals
- **Class** -- `Task`, `Column`, `Board` classes
- **Objects** -- Task instances created from class blueprints
- **Encapsulation** -- Private task state (status, priority) with controlled access via methods
- **Abstraction** -- `TaskTemplate` abstract class hiding creation complexity

### SOLID Principles
- **SRP** -- Separate classes: `Task`, `TaskRepository`, `TaskService`, `TaskSerializer`
- **OCP** -- New task types (Bug, Feature, Story) extend `Task` without modifying it

### Design Patterns

#### Prototype
Clone tasks from templates. Each template is a `Task` prototype with a `clone()` method that deep-copies the task, its subtasks, and labels. The backend stores template prototypes and clones them on request.

#### Memento
Save and restore board snapshots for undo/redo. A `BoardHistory` caretaker stores state snapshots. The API exposes `POST /boards/:id/snapshots` and `POST /boards/:id/restore` endpoints.

#### Iterator
Custom `TaskIterator` traverses all tasks across all columns, supporting filter predicates for priority, assignee, and due date. Used in search/filter endpoints and bulk operations.

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
