import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
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
  )
}
