import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/layout/app-sidebar"
import { SiteHeader } from "@/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function MainLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
