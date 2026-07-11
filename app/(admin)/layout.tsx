import "../theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { AdminLayoutClient } from "@/components/layouts/admin-layout-client";
import { ToastGlobal } from "@/components/toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Portfolio",
  description: "Kelola projects, dashboard, dan pengaturan",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActiveThemeProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <ToastGlobal />
    </ActiveThemeProvider>
  );
}
