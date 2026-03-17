import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DailyDataProvider } from "@/context/DailyDataProvider";
import { ClientOnly } from "@/components/client-only";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DailyDataProvider>
      <SidebarProvider>
        <ClientOnly fallback={<AppSidebarSkeleton />}>
          <AppSidebar />
        </ClientOnly>
        <SidebarInset>
          <div className="min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DailyDataProvider>
  );
}
