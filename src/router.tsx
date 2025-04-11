import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import Root from './pages/Root';
import HomePage from './pages/HomePage';

const rootRoute = createRootRoute({
  component: () => <Root />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage />,
  loader: async () => ({}),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
  ]),
  defaultPreload: 'intent',
  scrollRestoration: true,
});


