"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import ThemeInitializer from "@/components/theme-initializer";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="px-4 py-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
