import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layout/app-sidebar";
import { SiteHeader } from "@/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function MainLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--header-height": "3.5rem",
      } as React.CSSProperties}
    >
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar variant="inset" />

        {/* Content area */}
        <SidebarInset>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="sticky top-0 z-10">
              <SiteHeader />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}