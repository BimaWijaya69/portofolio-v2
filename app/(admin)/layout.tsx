import "../theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { AdminLayoutClient } from "@/components/layouts/admin-layout-client";

import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin Panel - Portfolio",
  description: "Kelola projects, dashboard, dan pengaturan",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <ActiveThemeProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "!bg-background/60 !backdrop-blur-xl !backdrop-saturate-150 !border !border-border/50 !shadow-lg !shadow-black/10",
            title: "!text-foreground !font-medium",
            description: "!text-muted-foreground",
            success: "!bg-background/60 !backdrop-blur-xl !border-green-500/20",
            error: "!bg-background/60 !backdrop-blur-xl !border-red-500/20",
          },
        }}
      />
    </ActiveThemeProvider>
  );
}
