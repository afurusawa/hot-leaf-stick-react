import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
;
export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { pathname } = useLocation(); // Get the current route path

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader currentPath={pathname} />
        <div className="">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
