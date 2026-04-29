// 'use client'
import { AppSidebar, SidebarToggleButton } from "@/components/app-sidebar";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <main className="flex flex-col h-full">
            <header className="flex items-center gap-2 p-2 border-b">
              <SidebarToggleButton />
            </header>
            <div className="flex-1 p-4">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Layout;
