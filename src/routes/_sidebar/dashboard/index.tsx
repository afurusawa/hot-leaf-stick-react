import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sidebar/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2">
      <p>This can be a dashboard page</p>
      <p>total cigars smoked</p>
      <p>total unique cigars</p>
      <p>palate</p>
      <p>distribution of reviews</p>
      <p>top cigars by rating</p>
      <p>top cigars by quantity</p>
    </div>
  );
}
