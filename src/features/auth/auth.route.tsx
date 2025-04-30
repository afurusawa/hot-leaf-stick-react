import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from '@/routes/__root';
import { RegisterPage } from './RegisterPage';

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
}); 