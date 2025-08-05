import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full bg-gradient-subtle">
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <Header />
            
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        
        {/* Global Sidebar Trigger */}
        <SidebarTrigger className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-elegant border" />
      </div>
    </SidebarProvider>
  );
};