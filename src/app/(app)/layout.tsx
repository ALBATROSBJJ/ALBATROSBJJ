import { AppSidebar } from "@/components/layout/sidebar";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DailyDataProvider } from "@/context/DailyDataProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <DailyDataProvider>
        <SidebarProvider>
          <AppSidebar />
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
