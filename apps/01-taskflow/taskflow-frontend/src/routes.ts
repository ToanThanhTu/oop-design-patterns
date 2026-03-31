import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('boards/:id', './pages/BoardPage.tsx'),
  index('./pages/HomePage.tsx'),
] satisfies RouteConfig
