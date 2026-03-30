'use client';

import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DailyDataProvider } from "@/context/DailyDataProvider";
import { ClientOnly } from "@/components/client-only";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";

function FullPageLoader() {
  return (
    <div className="flex min-h-screen bg-background">
        <AppSidebarSkeleton />
        <div className="flex-1 p-4 md:p-8 space-y-8">
            <header>
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-5 w-2/3 mt-2" />
            </header>
            <div className="space-y-8">
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div className="dark"><FullPageLoader /></div>;
  }
  
  return (
    <div className="dark">
      <DailyDataProvider>
        <SidebarProvider>
          <ClientOnly fallback={<AppSidebarSkeleton />}>
            <AppSidebar />
          </ClientOnly>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/90 backdrop-blur-sm px-4 md:hidden">
              <Logo />
              <SidebarTrigger className="text-primary" />
            </header>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </DailyDataProvider>
    </div>
  );
}
