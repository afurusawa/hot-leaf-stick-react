import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import Root from './pages/Root';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/collection/CollectionPage';

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
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/collection',
      component: () => <CollectionPage />,
      loader: async () => ({}),
    })
  ]),
  defaultPreload: 'intent',
  scrollRestoration: true,
});


