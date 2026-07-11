"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import React, { ReactNode, useEffect } from "react";
import ThemeInitializer from "@/components/theme-initializer";
import { usePathname } from "next/navigation";

interface AdminLayoutClientProps {
  children: ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    console.log(`[Admin] Accessing: ${pathname}`);
  }, [pathname]);

  return (
    <>
      <ThemeInitializer />
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />

          <main className="w-full flex-1 overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
