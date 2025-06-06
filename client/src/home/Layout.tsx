// Layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SideBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="mt-4" />
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-4 max-w-6xl w-full mx-auto my-4">
        <Outlet />
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
