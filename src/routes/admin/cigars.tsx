import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/cigars')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Outlet />
    </div>
  );
}
