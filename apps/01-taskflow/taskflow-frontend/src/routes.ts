import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('/api/tasks/:id/subtasks', './routes/api.tasks.$id.subtasks.tsx'),
  route('/api/tasks/:id/labels', './routes/api.tasks.$id.labels.tsx'),
  route('boards/:id', './pages/BoardPage.tsx'),
  index('./pages/HomePage.tsx'),
] satisfies RouteConfig
