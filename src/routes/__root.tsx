import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router"
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

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
        <div className="flex w-full items-center gap-2 p-6 lg:gap-2 lg:px-6">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
