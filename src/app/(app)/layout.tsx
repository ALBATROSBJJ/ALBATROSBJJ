import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/sidebar";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DailyDataProvider } from "@/context/DailyDataProvider";
import { ClientOnly } from "@/components/client-only";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
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
    </FirebaseClientProvider>
  );
}
