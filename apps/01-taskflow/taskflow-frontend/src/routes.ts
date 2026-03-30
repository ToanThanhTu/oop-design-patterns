import { route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('/about', './pages/about.tsx'),
  route('*?', 'catchall.tsx'),
] satisfies RouteConfig
