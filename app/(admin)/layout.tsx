import "../theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/layouts/admin-layout-client";
import { ToastGlobal } from "@/components/toast";

export default async function RootLayout({
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
