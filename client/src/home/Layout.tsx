// Layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SideBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="sticky top-0 z-20 -mb-1 flex h-9 shrink-0 items-center px-0 sm:px-2">
        <SidebarTrigger
          className="-ml-0.5 size-8"
          aria-label="Abrir menú de navegación"
        />
      </div>
      <main className="min-w-0 flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-3 lg:px-6">
        <Outlet />
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
