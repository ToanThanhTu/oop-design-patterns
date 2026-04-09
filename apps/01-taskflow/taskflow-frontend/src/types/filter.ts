export interface Filter {
  assignee?: string
  dueDateFrom?: string
  dueDateTo?: string
  label?: string
  priority?: string
  type?: "bug" | "feature" | "story" | "task"
}