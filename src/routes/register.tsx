import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
}); 