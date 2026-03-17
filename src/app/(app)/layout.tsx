'use client';

import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DailyDataProvider } from "@/context/DailyDataProvider";
import { ClientOnly } from "@/components/client-only";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
    return <FullPageLoader />;
  }
  
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
