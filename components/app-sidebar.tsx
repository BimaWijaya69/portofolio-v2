// components/app-sidebar.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  HelpCircleIcon,
  SettingsIcon,
  FolderGit2Icon,
  PlusCircleIcon,
  HomeIcon,
} from "lucide-react";

import { NavMain, type NavItem } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// 🔥 Sesuai dengan format NavMain
const navMainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Projects",
    icon: FolderGit2Icon,
    items: [
      {
        title: "All Projects",
        url: "/projects",
        icon: FolderGit2Icon,
      },
    ],
  },
];

const navSecondaryItems = [{ title: "home", url: "/home", icon: HomeIcon }];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <span className="text-base font-semibold">Bima Verse.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* 🔥 Kirim items ke NavMain */}
        <NavMain items={navMainItems} pathname={pathname} />
        <NavSecondary
          items={navSecondaryItems}
          pathname={pathname}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
